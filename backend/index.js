//Connect to mongodb using mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'meds',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) :
    console.log('Connected to database successfully'));


//Schema - define all the feilds to store data in database, It is also known as model
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    usertype: {
        type: String,
        required: true,
    },
});

const MedicalSchema = new mongoose.Schema({
    storename: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    license: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
})

const MedicineSchema = new mongoose.Schema({

    medname: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    license: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    },
    u_price: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    medical_email: {
        type: String,
        required: true,
    },

})




const AdminData = mongoose.model('admindata', AdminSchema);
AdminData.createIndexes();
const LoginData = mongoose.model('logindata', LoginSchema);
LoginData.createIndexes();
const MedicalData = mongoose.model('medicaldata', MedicalSchema);
MedicalData.createIndexes();
const MedicineData = mongoose.model('medicinedata', MedicineSchema);
MedicineData.createIndexes();


//create server
const express = require('express');

const session = require('express-session');
var cookieParser = require('cookie-parser');


const app = express();
const cors = require("cors");
console.log("service started at http://localhost:5000");
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use(session({
    secret: "my-secrest-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000,
        httpOnly: false,
        domain: "localhost"
    }
}));

app.post("/check_login", async (req, res) => {
    try {
        const em = req.body.email;
        const ps = req.body.password;
        console.log(em);
        const user = await LoginData.findOne({ email: em, password: ps });
        console.log(user);

        session.email = em;
        session.usertype = user.usertype;
        session.isLoggedIn = true;


        res.json({
            usertype: user.usertype
        });
    } catch (e) {
        console.log("Error: Problem");
        console.log(e);
        res.status(500).json({ error: 'server error' });
    }
});



app.get("/isUser", async (req, res) => {
    console.log("The session is: ", session);
    if (session.isLoggedIn) {
        res.json({
            usertype: session.usertype,
            email: session.email
        });
    }
    else {
        res.json({
            "usertype": "no user"
        });
    }
});

app.get("/logout", async (req, res) => {
    session.isLoggedIn = false;
    session.email = "";
    session.usertype = "";
    res.json({
        "msg": "success"
    });
});


app.post("/register_admin", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const nm = req.body.name;
        const adr = req.body.address;
        const mobile = req.body.contact;
        const em = req.body.email;
        const pass1 = req.body.password;
        const pass2 = req.body.cpassword;
        const utype = "admin";

        const ad1 = new AdminData({ name: nm, address: adr, contact: mobile, email: em });
        const lgn = new LoginData({ email: em, password: pass1, usertype: utype });

        let result = await ad1.save();
        let result1 = await lgn.save();

        result = result.toObject();
        if (result) {
            res.json(
                {
                    "msg": "Data received and saved"
                }
            );
        }
        else {
            res.json(
                {
                    "msg": "Unable to save data"
                }
            );
        }
    }
    catch (e) {
        console.log(e);
        res.json(
            {
                "msg": "Error"
            }
        );
    }
});

//Save Medical Data
app.post("/register_medical", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const nm = req.body.sname;
        const own = req.body.owner;
        const adr = req.body.address;
        const mobile = req.body.contact;
        const lno = req.body.lno;
        const em = req.body.email;
        const pass1 = req.body.password;
        const pass2 = req.body.cpassword;
        const utype = "medical";

        const ad1 = new MedicalData({ storename: nm, owner: own, address: adr, contact: mobile, license: lno, email: em });
        // 'nm' is the variable that is locally declared, i.e. in try box. 'storename' is the variable that is being created in the medical schema.
        // In 'ShowMed' the variables used will of medical schema as they store the collection of data.
        const lgn = new LoginData({ email: em, password: pass1, usertype: utype });

        let result = await ad1.save();
        let result1 = await lgn.save();

        result = result.toObject();
        if (result) {
            res.json(
                {
                    "msg": "Data received and saved"
                }
            );
        }
        else {
            res.json(
                {
                    "msg": "Unable to save data"
                }
            );
        }
    }
    catch (e) {
        console.log(e);
        res.json(
            {
                "msg": "Error"
            }
        );
    }
});

app.get("/show_admins", async (req, res) => {
    try {
        const admins = await AdminData.find();
        console.log(admins);
        res.json(admins);


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error' });
    }
});

app.post("/update_admin", async (req, resp) => {
    try {
        const nm = req.body.name;
        const adr = req.body.address;
        const mobile = req.body.contact;
        const em = req.body.email;
        const filter = { email: em };
        const update = { name: nm, address: adr, contact: mobile };

        const result = await AdminData.findOneAndUpdate(filter, update, { new: true });
        console.log(result);
        resp.json({
            data: 'success',
            msg: 'Data Saved Successfully'
        });
    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot Save changes'
        });
    }
});

app.get("/show_medical", async (req, resp) => {
    try {
        const medical = await MedicalData.find();
        console.log(medical);
        resp.json(medical);


    } catch (err) {
        console.log(err);
        resp.status(500).json({ error: 'server error' });
    }
});

app.post("/get_medicals", async (req, resp) => {
    try {
        const em = req.body.id;
        console.log(em);
        const medical = await MedicalData.findOne({ email: em });
        console.log(medical);

        resp.json(medical);
    }
    catch (err) {
        console.log(err);
        resp.status(500).json({ error: 'server error' });
    }
});

app.post("/update_medical", async (req, resp) => {
    try {
        const snm = req.body.sname;
        const nm = req.body.owner;
        const adr = req.body.address;
        const mob = req.body.contact;
        const lno = req.body.lno;
        const em = req.body.id;
        const filter = { email: em };
        console.log(filter);
        const update = { storename: snm, owner: nm, address: adr, contact: mob, license: lno, email: em };
        console.log(update);
        const result = await MedicalData.findOneAndUpdate(filter, update, { new: true }); //filter: condition on which document is updated. update: parameters of the documnent to be updated. new:true-> new updated document
        console.log(result);
        resp.json({
            data: 'success',
            msg: 'Data Saved Successfully'
        });
    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});

app.post("/delete_medical", async (req, resp) => {
    try {
        const snm = req.body.sname;
        const nm = req.body.owner;
        const adr = req.body.address;
        const mob = req.body.contact;
        const lno = req.body.lno;
        const em = req.body.id;
        const filter = { email: em };
        console.log(filter);
        const del = { storename: snm, owner: nm, address: adr, contact: mob, license: lno, email: em };
        console.log(del);
        const result = await MedicalData.findOneAndDelete(filter, del);
        console.log(result);
        resp.json({
            data: 'success',
            msg: 'Data Deleted Successfully'
        });
    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});


app.post("/change_pass", async (req, resp) => {
    try {
        if (session.isLoggedIn) {
            em = session.email
            const old = req.body.curr;
            const ps = req.body.pass;
            //const con=req.body.confirm;
            const filter = { email: em, password: old };

            const update = { password: ps };
            console.log(update);
            const result = await LoginData.findOneAndUpdate(filter, update, { new: true });
            console.log(result);
            resp.json({
                data: 'success',
                msg: 'Data Saved Successfully'
            });
        }
        else {
            resp.json({
                data: 'Failed',
                msg: 'Login To change'
            });
        }

    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});


app.get("/get_admin", async (req, resp) => {
    try {
        em = session.email;
        const admin = await AdminData.findOne({ email: em });
        console.log("get_admin : ", admin);
        resp.json(admin);
    }
    catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot get admin'
        });
    }
});

app.post("/update_admin_profile", async (req, resp) => {
    try {
        if (session.isLoggedIn) {
            em = session.email
            const nm = req.body.name;
            const add = req.body.address;
            const cont = req.body.contact;
            //const con=req.body.confirm;
            const filter = { email: em };

            const update = { name: nm, address: add, contact: cont };
            console.log(update);
            const result = await AdminData.findOneAndUpdate(filter, update, { new: true });
            console.log(result);
            resp.json({
                data: 'success',
                msg: 'Data Saved Successfully'
            });
        }
        else {
            resp.json({
                data: 'Failed',
                msg: 'No changes made'
            });
        }

    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});

app.get("/show_medicals", async (req, resp) => {
    try {
        const medical = await MedicalData.find();
        console.log(medical);
        resp.json(medical);


    } catch (err) {
        console.log(err);
        resp.status(500).json({ error: 'server error' });
    }
});

app.get("/get_medical", async (req, resp) => {
    try {
        em = session.email;
        const medical = await MedicalData.findOne({ email: em });
        console.log("get_medical : ", medical);
        resp.json(medical);
    }
    catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot get medical'
        });
    }
});

app.post("/update_medical_profile", async (req, resp) => {
    try {
        if (session.isLoggedIn) {
            em = session.email
            const nm = req.body.storename;
            const ow = req.body.owner;
            const add = req.body.address;
            const cont = req.body.contact;
            const l = req.body.license;
            const filter = { email: em };

            const update = { storename: nm, owner: ow, address: add, contact: cont, license: l };
            console.log(update);
            const result = await MedicalData.findOneAndUpdate(filter, update, { new: true });
            console.log(result);
            resp.json({
                data: 'success',
                msg: 'Data Saved Successfully'
            });
        }
        else {
            resp.json({
                data: 'Failed',
                msg: 'No changes made'
            });
        }

    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});


app.post("/register_medicine", async (req, res) => {
    try {
        console.log(session.email);
        if (session.isLoggedIn) {
            em = session.email
            const data = req.body;
            console.log(data);
            const nm = req.body.name;
            const c = req.body.com;
            const lno = req.body.lic;
            const d = req.body.desp;
            const up = req.body.uprice;
            const ty = req.body.type;

            console.log(nm, c, lno, d, up, ty);

            const ad1 = new MedicineData({ medical_email: em, medname: nm, company: c, license: lno, des: d, u_price: up, type: ty });
            let result = await ad1.save();
            result = result.toObject();
            console.log(result);
            if (result) {
                res.json(
                    {
                        "msg": "Data received and saved"
                    }
                );
            }
            else {
                res.json(
                    {
                        "msg": "Unable to save data"
                    }
                );
            }
        }
        else {
            res.json({
                data: 'Failed',
                msg: 'Login To change'
            });
        }
    }
    catch (e) {
        console.log(e);
        res.json(
            {
                "msg": "Error"
            }
        );
    }
});

app.get("/show_medicine", async (req, resp) => {
    try {
        const em = session.email;
        const medicine = await MedicineData.find({ medical_email: em });

        if (medicine.length > 0) {
            console.log(medicine);
            resp.json(medicine);
        } else {
            resp.json({ msg: "No medicines found" });
        }
    } catch (err) {
        console.log(err);
        resp.status(500).json({ error: "Server error" });
    }
});


app.post("/get_medicine", async (req, resp) => {
    try {
        const id = req.body.id;

        const medicine = await MedicineData.findOne({ _id: id });
        console.log(medicine);

        resp.json(medicine);
    }
    catch (err) {
        console.log(err);
        resp.status(500).json({ error: 'server error' });
    }
});

app.post("/update_medicine", async (req, resp) => {
    try {
        const id = req.body.id;
        const nm = req.body.name;
        const c = req.body.com;
        const l = req.body.lic;
        const d = req.body.desp;
        const t = req.body.type;
        const p = req.body.uprice;
        const filter = { _id: id };
        console.log(filter);
        const update = { _id: id, medname: nm, company: c, license: l, des: d, type: t, u_price: p };
        console.log(update);
        const result = await MedicineData.findOneAndUpdate(filter, update, { new: true }); //filter: condition on which document is updated. update: parameters of the documnent to be updated. new:true-> new updated document
        console.log(result);
        resp.json({
            data: 'success',
            msg: 'Data Updated Successfully'
        });
    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});

app.post("/delete_medicine", async (req, resp) => {
    try {
        const id = req.body.id;
        const nm = req.body.name;
        const c = req.body.com;
        const l = req.body.lic;
        const d = req.body.des;
        const t = req.body.type;
        const filter = { _id: id };
        console.log(filter);
        const update = { _id: id, medname: nm, company: c, license: l, des: d, type: t };
        console.log(update);
        const result = await MedicineData.findOneAndDelete(filter, update); //filter: condition on which document is updated. update: parameters of the documnent to be updated. new:true-> new updated document
        console.log(result);
        resp.json({
            data: 'success',
            msg: 'Data Deleted Successfully'
        });
    } catch (e) {
        console.log(e);
        resp.json({
            data: 'error',
            msg: 'Cannot save changes'
        });
    }
});

app.post("/get_med", async (req, resp) => {
    try {
        const m = req.body.mediname;
        console.log("Medicine name: ", m);

        const medicines = await MedicineData.aggregate([
            {
                $match: {
                    medname: { $regex: m, $options: 'i' }
                }
            },
            {
                $lookup: {
                    from: "medicaldatas",  
                    localField: "medical_email",
                    foreignField: "email",
                    as: "storeInfo"
                }
            },
            {
                $unwind: "$storeInfo"
            },
            {
                $project: {
                    medname: 1,
                    company: 1,
                    des: 1,
                    u_price: 1,
                    type: 1,
                    license: 1,
                    storename: "$storeInfo.storename",
                    contact: "$storeInfo.contact",
                    address: "$storeInfo.address"
                }
            }
        ]);

        console.log("Joined Medicine Data: ", medicines);
        resp.json(medicines);
    } catch (e) {
        console.error(e);
        resp.status(500).json({
            data: 'error',
            msg: 'Cannot get medicine with store info'
        });
    }
});


app.post("/suggest_med", async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const meds = await MedicineData.find({
            medname: { $regex: keyword, $options: "i" }
        }).limit();
        res.json(meds);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});



//start server on port 5000
app.listen(5000);
