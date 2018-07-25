let prefix = ''
export const LOGIN = prefix + '/api/admin/login' // 登陆URL
export const ME = prefix + '/api/admin/me' //当前用户信息
export const USERS = prefix + '/api/admin/user' //授权用户信息
export const REFRESH_TOKEN = prefix + '/api/admin/refresh' //token刷新URL
export const PREFIX_ITEMS = prefix + '/api/admin/'
export const ITEM_PUBLISH = prefix + '/api/admin/items/{id}/publish' // api/admin/item/{id}/publish
export const ITEM_UPDATE = prefix + '/api/admin/items/{id}'
export const ITEM_DELETE = prefix + '/api/admin/items/{id}'
export const ITEM_CREATE = prefix + '/api/admin/items'
export const LOGOUT = prefix + '/api/admin/logout' // 登出
export const SHOP = prefix + '/api/admin/shop' //授权用户信息