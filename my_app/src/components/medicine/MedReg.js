import { useState } from "react";
import MedMenu from "../medical/MedMenu";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

function MedReg() {
    const [name, setName] = useState("");
    const [com, setCom] = useState("");
    const [lic, setLic] = useState("");
    const [desp, setDesp] = useState("");
    const [uprice, setUprice] = useState("");
    const [type, setType] = useState("");
    const [result, setResult] = useState("");

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        console.log(name,com,lic,desp,uprice,type); //to monitor if the data is being saved

        let r = await fetch('http://localhost:5000/register_medicine', {
            method: 'post',
            body: JSON.stringify({ name, com, lic, desp, uprice, type }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        r = await r.json();
        console.log(r)
        if (r) {
            setResult("Data Saved Successfully!");
            setName("");
            setCom("");
            setLic("");
            setDesp("");
            setUprice("");
            setType("");
        }
    };

    return (
        <>
            <MedMenu />
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow p-4">
                            <Card.Body>
                                <Card.Title className="text-center text-primary mb-4">
                                    Medicine Registration
                                </Card.Title>
                                <Form onSubmit={handleOnSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Medicine Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter medicine name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter company name"
                                            value={com}
                                            onChange={(e) => setCom(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>License</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter license"
                                            value={lic}
                                            onChange={(e) => setLic(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Medicine Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter description"
                                            value={desp}
                                            onChange={(e) => setDesp(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Unit Price</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter unit price"
                                            value={uprice}
                                            onChange={(e) => setUprice(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Medicine Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter medicine type"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                        />
                                    </Form.Group>

                                    <div className="text-center mt-4">
                                        <Button variant="success" type="submit">
                                            Register Medicine
                                        </Button>
                                    </div>
                                </Form>

                                {result && (
                                    <Alert variant="success" className="mt-4 text-center">
                                        {result}
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MedReg;
