import * as types from './mutation-types'
import { setToken, clearStorage, clearToken } from 'common/js/storage'

export const setUser = function ({commit}, user) {
  setToken(user.token)
  commit(types.SET_USER, user)
}

export const userOut = function ({commit, state}) {
  clearStorage()
  clearToken()
}
