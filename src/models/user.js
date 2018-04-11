import { query as queryUsers, createUser, userLogout, accountLogin, getOne } from '../services/user';
import { routerRedux } from 'dva/router'
import { message } from 'antd'

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0
      }
    },
    loading: false,
    currentUser: {},
    detailUser: {}
  },

  effects: {
    * fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const { data } = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: data
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
    },

    * create({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      yield call(createUser, payload);
      yield put({
        type: 'changeLoading',
        payload: false
      });
    },

    * login({ payload }, { put, call }) {
      yield put({
        type: 'changeSubmitting',
        payload: true
      });
      const { callback, ...rest } = payload
      const response = yield call(accountLogin, rest);
      if (response && response.code === 2000) {
        message.error(response.msg);
      } else if (response && response.code === 1000) {
        const user = response.data
        localStorage.sc_admin_user = JSON.stringify(user);
        yield put({
          type: 'setCurrentUser',
          payload: response.data
        });

        if (callback) {
          callback()
        }
      }

      yield put({
        type: 'changeSubmitting',
        payload: false
      });
    },

    * logout(_, { put, call }) {
      localStorage.removeItem('sc_admin_user')
      yield call(userLogout)
      yield put(routerRedux.push('/user/login'));
    },
    * getDetailOf({ payload }, { put, call }) {
      const { data } = yield call(getOne, payload)
      yield put({
        type: 'setDetailUser',
        payload: data
      })
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload
      };
    },
    setCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      };
    },
    setDetailUser(state, { payload }) {
      return {
        ...state,
        detailUser: payload
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload
        }
      };
    }
  }
};
