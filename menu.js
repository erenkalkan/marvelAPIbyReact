import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Card } from "react-bootstrap";
import { SpinnerCircular } from "spinners-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Modal, Button } from "antd";
import { useHistory } from "react-router-dom";

const ApiCalling = () => {

  let history = useHistory();
  console.log(history);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (card) => {
    setIsModalVisible(card);
  };

  const handleOk = (e) => {
    console.log(e);
    // history.push("/home");
    setIsModalVisible(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setIsModalVisible(false);
  };

  const [stateCharacters, setStateCharacters] = useState({
    results: [],
    offset: -1,
    limit: 30,
    page: 1,
  });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const getCharacter = async () => {
    if (loading) return;
    setLoading(true);
    const res = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters`,
      {
        params: {
          offset: (stateCharacters.offset + 1) * stateCharacters.limit,
          limit: stateCharacters.limit,
          apikey: "4d2d5805dd932c0f136cf1fcc1f53ba9",
          hash: "d4ddb0a09f709815e093cbe5de2c56bb",
          ts: 1,
        },
      }
    );

    setLoading(false);
    if (res.status === 200) {
      setStateCharacters((prevStateCharacters) => {
        const newResults = [...prevStateCharacters.results];
        return {
          ...res.data.data,
          results: newResults.concat(res.data.data.results),
        };
      });
    }
  };

  useEffect(() => {
    getCharacter();
    showModal();
    handleOk();
    // handleCancel();
  }, [page]);

  const RenderCard = ({ card, index }) => {
    // console.log("CARD", card);
    return (
      <>
        <Card style={{ width: "20rem" }} key={index}>
          {card.thumbnail && (
            <Card.Img
              variant="top"
              key={index}
              src={`${card.thumbnail.path}.${card.thumbnail.extension}`}
              style={{ width: "100%", height: "200px" }}
            />
          )}
          <Card.Body>
            {card.name && <Card.Title>{card.name}</Card.Title>}
            <Button type="primary" onClick={() => showModal(card)}>
              More Information
            </Button>
          </Card.Body>
        </Card>
      </>
    );
  };
  return (
    <>
      <div className="card-heros__title">MARVEL CHARACTERS</div>
      {loading && (
        <div className="loading">
          <SpinnerCircular />
        </div>
      )}
      <div className="card-heros" id="card-heros">
        {stateCharacters.results.map((item, index) => (
          <InfiniteScroll
            key={index}
            dataLength={item}
            next={() => {
              setPage(page + 1);
            }}
            hasMore={true}
          >
            <RenderCard card={item} key={index} />
          </InfiniteScroll>
        ))}
      </div>

      <Modal
        title="Marvel Characters"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isModalVisible && (
          <div>
            {console.log("İS MODAL VİSİBLE", isModalVisible)}
            <Card style={{ width: "18rem", marginLeft: "90px" }}>
              <Card.Img
                variant="top"
                src={`${isModalVisible.thumbnail.path}.${isModalVisible.thumbnail.extension}`}
              />
              <Card.Body>
                <Card.Title>{isModalVisible.name}</Card.Title>
                <Card.Text>
                  {isModalVisible.description}
                  <br></br>
                  <h3>Comics</h3>
                </Card.Text>
                {isModalVisible.stories.items.map((story) => (
                  <Card.Title>{story.name}</Card.Title>
                ))}
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ApiCalling;
