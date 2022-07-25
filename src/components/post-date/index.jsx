import React from 'react'

import './index.scss'

export const PostDate = ({ date, category }) => {
  return <p className="post-date">
    <span>{category} | </span>
    <span style={{ color: '#3f526b' }}></span>{date}
  </p>
}
