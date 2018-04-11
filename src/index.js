import 'babel-polyfill';
import dva from 'dva';
import 'moment/locale/zh-cn'
import createLoading from 'dva-loading'
// import browserHistory from 'history/createBrowserHistory';
import './index.less';
import router from './router'
import globalModel from './models/global'

// 1. Initialize
const app = dva({
  // history: browserHistory(),
});

// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(globalModel)

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
