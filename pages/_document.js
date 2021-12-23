import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { OLD_GOOGLE_ANALYTICS_ID, GA4_ID } from '../src/modules/ganalytics/AnalyticsProvider';

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
          {(OLD_GOOGLE_ANALYTICS_ID || GA4_ID) && (
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
                    gtag('config', '${OLD_GOOGLE_ANALYTICS_ID}');
                    `,
                  // gtag('config',  '${GA4_ID}')
                }}
              />
            </>
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
