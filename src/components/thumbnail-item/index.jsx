import React from 'react'
import { Link } from 'gatsby'
import { TARGET_CLASS } from '../../utils/visible'

import './index.scss'

export const ThumbnailItem = ({ node }) => (
  <Link className={`thumbnail ${TARGET_CLASS}`} to={node.fields.slug}>
    <div key={node.fields.slug}>
      <h3>{node.frontmatter.title || node.fields.slug}</h3>
      <p>
        <time className="thumbnail-date">
          <span style={{ color: '#969696', fontSize: '15px', fontWeight: 'normal' }}>
            {node.frontmatter.category} | </span>
          {node.frontmatter.date}
        </time>
      </p>
      <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
    </div>
  </Link>
)
