import React from "react";
import Breadcrumb from "../../components/breadcrumb";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { Badge, Button, Col, Form, Row, Table } from "reactstrap";
import Link from "next/link";
import MyModal from "../../components/modal";
import { useState } from "react";
import InputText from "../../components/form/form-item/InputText";
import MessageInput from "../../components/form/form-item/msg-input";
import { TicketApi } from "../../api/main/ticket";
import { toast } from "react-toastify";
import { useEffect } from "react";
const Ticket = ({ setLoader }) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [ticketList, setTicketlist] = useState(null);
  const getTicket = () => {
    setLoader(true);
    TicketApi.get()
      .then((res) => {
        setTicketlist(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const openTicket = (e) => {
    e.preventDefault();
    TicketApi.create({ parent_id: 0, type: "question", content, subject })
      .then((res) => {
        getTicket();
        setVisible(false);
        setContent("");
        setSubject("");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    getTicket();
  }, []);
  return (
    <div className="ticket-wrapper">
      <Breadcrumb />
      <div className="ticket-content">
        <div className="card ticket-btn" onClick={() => setVisible(true)}>
          <div className="icon">
            <AddLineIcon size={36} />
          </div>
          <span>Open new ticket</span>
        </div>
        <div className="ticket-table">
          <Table responsive borderless>
            <thead>
              <tr>
                <th>#Ticket ID</th>
                <th>Sending Date</th>
                <th>Subject</th>
                <th>Content</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {ticketList?.map((item, id) => (
                <tr key={id}>
                  <th scope="row">{`#${item.id}`}</th>
                  <td>{item.created_at?.slice(0, 19)}</td>
                  <td>{item.subject}</td>
                  <td>{item.content}</td>
                  <td>
                    <Badge color="success">{item.status}</Badge>
                  </td>
                  <td>
                    <Link href={`/ticket/${item.id}`}>
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <MyModal
        setVisible={setVisible}
        visible={visible}
        centered={true}
        title="Open a ticket"
        className="ticket-modal"
      >
        <Form onSubmit={openTicket}>
          <InputText
            onChange={(e) => setSubject(e.target.value)}
            label="Subject"
            placeholder="Subject"
            required={true}
          />

          <MessageInput
            onChange={(e) => setContent(e.target.value)}
            required={true}
          />
          <Row className="mt-4">
            <Col className="w-100 d-flex justify-content-end">
              <Button
                className="btn btn-danger w-100"
                onClick={() => setVisible(false)}
              >
                Cancel
              </Button>
            </Col>
            <Col className="w-100 d-flex justify-content-end">
              <Button className="btn btn-success w-100">Open</Button>
            </Col>
          </Row>
        </Form>
      </MyModal>
    </div>
  );
};
export default Ticket;
