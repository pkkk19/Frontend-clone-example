import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Row,
} from "reactstrap";
import { TicketApi } from "../../api/main/ticket";
import Breadcrumb from "../../components/breadcrumb";
import MsgInput from "../../components/form/form-item/msg-input";
import ListLoader from "../../components/loader/list";
const TicketDetail = () => {
  const router = useRouter();
  const id = router.query.id;
  const [ticketDetail, setTicketDetail] = useState(null);
  const [content, setContent] = useState("");
  const getTicketDetail = () => {
    TicketApi.getId(id)
      .then((res) => {
        setTicketDetail(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const sentReply = (e) => {
    e.preventDefault();
    TicketApi.create({ parent_id: id, type: "response", content })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (id) getTicketDetail();
  }, [id]);
  return (
    <div className="ticket-detail">
      <Breadcrumb />
      <Card>
        <CardHeader>
          {ticketDetail ? (
            <div className="text-md-left">
              <h5 className="mb-md-0 h5 ticket-id">
                {`${ticketDetail?.subject} #${ticketDetail?.id}`}
              </h5>
              <div className="mt-2 muted-text">
                <span> Paul K. Jensen </span>
                <span className="ml-2">
                  {ticketDetail?.created_at?.slice(0, 19)}
                </span>
                <Badge>{ticketDetail?.status}</Badge>
              </div>
            </div>
          ) : (
            <ListLoader />
          )}
        </CardHeader>
        <CardBody>
          <Form onSubmit={sentReply}>
            <Row>
              <Col md={12}>
                <MsgInput onChange={(e) => setContent(e.target.value)} />
              </Col>
              <Col md={12} className="d-flex justify-content-end">
                <Button className="mt-2 btn btn-success">Submit</Button>
              </Col>
            </Row>
          </Form>
          <div className="pad-top">
            <ul className="list-group list-group-flush">
              {ticketDetail?.children?.map((ticket) => {
                return (
                  <li key={ticket.id} className="list-group-item px-0">
                    <div className="media mb-4">
                      <span className="avatar avatar-sm mr-3">
                        <img
                          src="https://demo.activeitzone.com/ecommerce/public/uploads/all/jxUqbB2ThpoDFZbBtPHaiy2pF7i02hDaFJEEF9rx.png"
                          onError="this.onerror=null;this.src='https://demo.activeitzone.com/ecommerce/public/assets/img/avatar-place.png';"
                        />
                      </span>
                      <div className="media-body">
                        <span>William C. Schroyer</span>
                        <p className="muted-text">2022-04-27 21:07:13</p>
                      </div>
                    </div>
                    <p>{ticket?.content}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TicketDetail;
