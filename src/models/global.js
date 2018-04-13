
export default {
  namespace: 'global',

  state: {
    currentSystem: 0,
    collapsed: false,
    notices: [],
    fetchingNotices: false,
  },

  effects: {
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
