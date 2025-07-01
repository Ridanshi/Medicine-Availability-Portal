import GenMenu from "./GenMenu";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup,
  Table,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

function HomePage() {
  const [result, setResult] = useState("");
  const [mediname, setMedName] = useState("");
  const [medicines, setMedicines] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setResult("");
    try {
      const res = await fetch("http://localhost:5000/get_med", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediname }),
      });
      const data = await res.json();
      setMedicines(data);
      console.log(data);
      if (!data || data.length === 0) {
        setResult("No matching medicine found");
      }
    } catch (err) {
      console.error(err);
      setResult("Server error");
    }
  };

  return (
    <>
      <GenMenu />

      <Container className="mt-4">
        <h2 className="text-center text-primary mb-4">Find your medicine here</h2>
        <Form autoComplete="off" onSubmit={handleSearch}>
          <Row className="justify-content-center">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search medicine..."
                  value={mediname}
                  onChange={(e) => setMedName(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>

        {/* Optional result message */}
        {result && (
          <Row className="justify-content-center mt-3">
            <Col md={6}>
              <Alert variant="warning" className="text-center">
                {result}
              </Alert>
            </Col>
          </Row>
        )}
      </Container>

      {/* Only show this table if medicines were found */}
      {medicines.length > 0 && (
        <Container className="py-5">
          <h3 className="mb-4 text-primary text-center fw-bold">Medicines Available</h3>

          <Table striped bordered hover responsive className="shadow-sm rounded-3">
            <thead className="table-dark">
              <tr>
                <th>Medicine Name</th>
                <th>Company</th>
                <th>Storename</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Type</th>
                <th>Contact Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m._id}>
                  <td>{m.medname}</td>
                  <td>{m.company}</td>
                  <td>{m.storename}</td>
                  <td>{m.des}</td>
                  <td>{m.u_price}</td>
                  <td>{m.type}</td>
                  <td>{m.contact}</td>
                  <td>{m.address}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      )}
    </>
  );
}

export default HomePage;
