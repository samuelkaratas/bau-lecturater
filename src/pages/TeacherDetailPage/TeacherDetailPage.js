import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import "./TeacherDetailPage.css";

import { Card, ListGroup, Spinner } from "react-bootstrap";
import CommentForm from "../../components/commentForm/commentForm";
import DetailsJumbotron from "../../components/detailsJumbotron/detailsJumbotron";
import Comment from "../../components/comments/comments";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/selectors/authSelector";
import axios from "axios";

import CommentPagination from "../../components/pagination/pagination";

const TeacherDetailPage = () => {
  const location = useLocation();
  const cuurentUser = useSelector(selectCurrentUser);
  let { teacherId } = useParams();

  const [teacherInfo, setTeacherInfo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  useEffect(() => {
    //console.log(teacherId);
    const fetchLecture = async () => {
      if (location.state) {
        const res = await axios.post(
          "http://localhost:3000/instructor/get_by_name",
          {
            name: location.state.name,
          }
        );
        setTeacherInfo(res.data.doc);
      } else {
        const res = await axios.get(
          `http://localhost:3000/instructor/${teacherId}`
        );
        setTeacherInfo(res.data.doc);
      }
    };

    fetchLecture();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (teacherInfo) {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentComments = teacherInfo.comments.slice(
      indexOfFirstPost,
      indexOfLastPost
    );

    return (
      <div className="details-container">
        <DetailsJumbotron
          lectureId={teacherId}
          name={teacherInfo.name}
          shortDesc={teacherInfo.description}
          rating={teacherInfo.rating}
          jumboForTeacher={true}
        />
        <Card style={{ width: "100vw", marginBottom: "10px" }} body>
          {teacherInfo.description}
        </Card>
        <Card style={{ width: "100vw" }}>
          <Card.Header>Fundamental Information</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              Classes:{" "}
              {teacherInfo.lectures.map((cur) => (
                <Link
                  key={cur._id}
                  style={{
                    textDecoration: "underline",
                    color: "#67a0e0",
                    cursor: "pointer",
                  }}
                  to={`/lectures/${cur.lectureID}`}
                >
                  {cur.lectureName},{" "}
                </Link>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Card>
          <CommentForm pageId={teacherId} commentForTeacher={true} />
        {currentComments.map((cur) => (
          <Comment
            key={cur._id}
            username={cur.user}
            rating={cur.score}
            comment={cur.comment}
            isAnonymous={cur.isAnon}
          />
        ))}
        <CommentPagination
          postsPerPage={postsPerPage}
          totalPosts={teacherInfo.comments.length}
          paginate={paginate}
        />
      </div>
    );
  } else {
    return (
      <div className="loading-container">
        <Spinner animation="grow" variant="info" />
      </div>
    );
  }
};

export default TeacherDetailPage;
