import React, { useState } from "react";

import Pagination from 'react-bootstrap/Pagination'

const CommentPagination = ({ postsPerPage, totalPosts, paginate }) => {
  const [active, setActive] = useState(1)
  let items = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === active}
        onClick={() => {
            paginate(i)
            setActive(i)
        }}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <div className='mt-3'>
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default CommentPagination;
