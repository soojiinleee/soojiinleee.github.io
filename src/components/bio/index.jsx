import React, { forwardRef } from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import Image from 'gatsby-image'

import './index.scss'

export const Bio = forwardRef((props, ref) => {
  return <StaticQuery
    query={bioQuery}
    render={data => {
      const { author, social, introduction } = data.site.siteMetadata

      return (
        <div ref={ref} className="bio">
          <div className="author">
            <div className="author-description">
              <Image
                className="author-image"
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  borderRadius: `100%`,
                }}
              />
              <div className="author-name">
                <span className="author-name-prefix">작성자</span>
                <Link to={'/about'} className="author-name-content">
                  <span>@{author}</span>
                </Link>
                <div className="author-introduction">{introduction}</div>
                <p className="author-socials">
                  {social.instagram && (
                    <a href={`https://www.instagram.com/${social.instagram}`}>
                      🍪 Instagram
                    </a>
                  )}
                  {social.github && (
                    <a href={`https://github.com/${social.github}`}>🍪 GitHub</a>
                  )}
                  {social.medium && (
                    <a href={`https://medium.com/${social.medium}`}>Medium</a>
                  )}
                  {social.twitter && (
                    <a href={`https://twitter.com/${social.twitter}`}>
                      🍪 Twitter
                    </a>
                  )}
                  {social.facebook && (
                    <a href={`https://www.facebook.com/${social.facebook}`}>
                      🍪 Facebook
                    </a>
                  )}
                  {social.linkedin && (
                    <a href={`https://www.linkedin.com/in/${social.linkedin}/`}>
                      🍪 LinkedIn
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }}
  />
})

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile.png/" }) {
      childImageSharp {
        fixed(width: 72, height: 72) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        introduction
        social {
          twitter
          github
          medium
          facebook
          linkedin
          instagram
        }
      }
    }
  }
`

export default Bio
