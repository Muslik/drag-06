import { createEvent, fork, serialize, forward, allSettled, Event, Scope } from 'effector';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { matchRoutes, MatchedRoute } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import serializeJS from 'serialize-javascript';

import { ROUTES } from '@drag/pages/routes';
import { logger } from '@drag/shared/lib/logger';
import { getStart, StartParams } from '@drag/shared/lib/page-routing';

import { App } from './App';

function lookupStartEvent<P>(match: MatchedRoute<P>): Event<StartParams> | undefined {
  if (match.route.component) {
    return getStart(match.route.component);
  }
  return undefined;
}

function routeWithEvent(event: Event<StartParams>) {
  return function <P>(route: MatchedRoute<P>) {
    return lookupStartEvent(route) === event;
  };
}

let assets: unknown;

const serverStarted =
  createEvent<{
    req: express.Request;
    res: express.Response;
  }>();

const requestHandled = serverStarted.map(({ req }) => req);

const routesMatched = requestHandled.map((req) => {
  const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
  return {
    routes: matchRoutes(ROUTES, req.path).filter(lookupStartEvent),
    query: Object.fromEntries(new URL(url).searchParams),
  };
});

for (const { component } of ROUTES) {
  const startPageEvent = getStart(component);
  if (!startPageEvent) continue;

  const matchedRoute = routesMatched.filterMap(({ routes, query }) => {
    const route = routes.find(routeWithEvent(startPageEvent));
    if (route) return { route, query };
    return undefined;
  });

  forward({
    from: matchedRoute.map(({ route, query }) => ({
      params: route.match.params,
      query,
    })),
    to: startPageEvent,
  });
}

const syncLoadAssets = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const cssLinksFromAssets = (assets, entrypoint) =>
  assets[entrypoint]?.css
    ? assets[entrypoint].css.map((asset) => `<link rel="stylesheet" href="${asset}">`).join('')
    : '';

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') =>
  assets[entrypoint]?.js
    ? assets[entrypoint].js.map((asset) => `<script src="${asset}"${extra}></script>`).join('')
    : '';

export const renderApp = (
  req: express.Request,
  res: express.Response,
  root: Scope,
  storesValues: Record<string, unknown>,
) => {
  const context: StaticRouterContext = {};

  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App root={root} />
    </StaticRouter>,
  );

  if (context.url) {
    return { redirect: context.url };
  }
  const html =
    // prettier-ignore
    `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Drag06</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssLinksFromAssets(assets, 'client')}
    </head>
    <body>
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
        <script>
          window['INITIAL_STATE'] = ${serializeJS(storesValues)}
        </script>
    </body>
    </html>`;

  return { html };
};

const server = express()
  .disable('x-powered-by')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get('/*', async (req: express.Request, res: express.Response) => {
    logger.info('[REQUEST] %s %s', req.method, req.url);
    const scope = fork();
    try {
      await allSettled(serverStarted, {
        scope,
        params: { req, res },
      });
    } catch (error) {
      logger.error(error);
    }
    const storesValues = serialize(scope);
    const { html = '', redirect = false } = renderApp(req, res, scope, storesValues);
    if (redirect) {
      res.redirect(redirect);
    } else {
      res.send(html);
    }
  });

export default server;
