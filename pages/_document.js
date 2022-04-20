import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import {
  OLD_GOOGLE_ANALYTICS_ID,
  GA4_ID,
  META_ID,
  GOOGLE_OPTIMIZE_ID,
} from '../src/common/context/AnalyticsProvider';
import Script from 'next/script';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          {/* meta .dev verification. Will remove in future */}
          {/* <meta name="facebook-domain-verification" content={'pvzsx7s3k2om21tjz7kmt6gpr0vaun'} /> */}
          <meta name="facebook-domain-verification" content="1shmkwfy1aajm8cbbwwe91f30j8ihi" />
          {/* {GOOGLE_OPTIMIZE_ID && (
            // eslint-disable-next-line @next/next/no-sync-scripts
            <script
              src={`https://www.googleoptimize.com/optimize.js?id=${GOOGLE_OPTIMIZE_ID}`}
            ></script>
          )} */}
          {(GA4_ID || OLD_GOOGLE_ANALYTICS_ID) && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${
                  GA4_ID || OLD_GOOGLE_ANALYTICS_ID
                }`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){
                      dataLayer.push(arguments);
                    }
                    gtag('js', new Date());
                    `,
                }}
              />
            </>
          )}
          {META_ID && (
            <noscript>
              <img
                height="1"
                width="1"
                alt="t"
                style={{
                  display: 'none',
                }}
                src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
