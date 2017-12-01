import * as express from 'express';
import { IStaticMiddlwareAbstract } from './abstract';
import { ParserMiddleware, IParserMiddlewareOptions } from './parser';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';

/**
 * Configurable middleware module.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bot-js-sdk';
 *
 * export = (app: express.Express): void => {
 *   app.use(OracleBot.Middleware.init({
 *     component: { // component middleware options
 *       cwd: __dirname, // root of application source
 *       path: './components', // relative directory for components in fs
 *       register: [ // explicitly provide a global registry
 *         './path/to/a/component',
 *         require('./path/to/another/component'),
 *         './path/to/other/components',
 *         './path/to/a/directory',
 *       ]
 *     }
 *   }));
 * };
 * ```
 */
export namespace Middleware {

  /**
   * MiddlewareOptions. Define options/configuration for Bot middleware.
   */
  export interface IMiddewareOptions {
    parser?: IParserMiddlewareOptions;
    component?: IComponentMiddlewareOptions;
  };

  /**
   * init middleware function. Add bot middleware to the app router stack.
   * @param options  options to configure the middleware.
   * @return express.Router
   * @todo add webhook middleware
   */
  export function init(options: IMiddewareOptions = {}): express.Router {
    const router = express.Router();

    // create iterable map
    const mwMap = new Map<string, IStaticMiddlwareAbstract>([
      ['parser', ParserMiddleware],
      ['component', ComponentMiddleware],
    ]);
    // iterate and apply the middleware layers
    mwMap.forEach((mw, key) => {
      if (mw.required || !!options[key]) {
        mw.extend(router, options[key]);
      }
    });

    return router;
  }
}
