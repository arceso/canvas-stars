import '../static/styles.styl'

import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import Particles from '../components/Particles/Particles'

export default class extends React.Component {

  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>

        <Head>
          <title>My page title</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        </Head>

    <Particles />

        <Link prefetch href="/test">
          <a>To the test!</a>
        </Link>        
      </div>
    )
  }
}

