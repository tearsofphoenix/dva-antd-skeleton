/**
 * @Author zlx
 * @Date 2018/2/5 下午5:11
 */
import { dynamicWrapper } from './nav';
// 额外页面写在这里
export default function page(app) {
  return [
    {
      name: '异常',
      path: 'exception',
      icon: 'warning',
      hide: true,
      children: [
        {
          name: '403',
          path: '403',
          component: dynamicWrapper(app, [], () =>
            import('../routes/Exception/403')
          )
        },
        {
          name: '404',
          path: '404',
          component: dynamicWrapper(app, [], () =>
            import('../routes/Exception/404')
          )
        },
        {
          name: '500',
          path: '500',
          component: dynamicWrapper(app, [], () =>
            import('../routes/Exception/500')
          )
        }
      ]
    }
  ]
}
