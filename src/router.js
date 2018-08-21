// import LoginComponent from './components/Login.vue'
const LoginComponent = () => import('./components/Login.vue')
const ItemsComponent  = () => import('./components/Items.vue')
const IndexComponent = () => import('./components/Index.vue')
const NavigationComponent = () => import('./components/Navigation.vue')
const ItemComponent = () => import('./components/Item.vue')
const ShopsComponent = () => import('./components/Shops.vue')
const UsersComponent = () => import('./components/Users.vue')
const SettingComponent = () => import('./components/Setting.vue')
const BargainsComponent = () => import('./components/Bargains.vue')
const EventsComponent = () => import('./components/Events.vue')
const EventItemsComponent = () => import('./components/EventItems.vue')
const AccountComponent = () => import('./components/Account.vue')
const RegisterComponent = () => import('./components/Register.vue')
const ErrorComponent = () => import('./components/Error.vue')
var config = [{
    path: '/login',
    name: 'login',
    meta: {
      title: '登陆'
    },
    // component: LoginComponent
    components: {
      'login': LoginComponent
    }
  },
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页'
    },
    components: {
      'mainContent': IndexComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/',
    name: 'logout',
    meta: {
      title: '登出'
    },
    components: {}
  },
  {
    path: '/error',
    name: 'error',
    meta: {
      title: '登出'
    },
    components: {
      'mainContent': ErrorComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/users',
    name: 'users',
    meta: {
      title: '授权用户'
    },
    components: {
      'mainContent': UsersComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/shops',
    name: 'shops',
    meta: {
      title: '店铺管理'
    },
    components: {
      'mainContent': ShopsComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '店铺管理'
    },
    components: {
      'mainContent': SettingComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/bargains',
    name: 'bargains',
    meta: {
      title: '砍价查看'
    },
    components: {
      'mainContent': BargainsComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/items',
    name: 'items',
    meta: {
      title: '商品管理'
    },
    components: {
      'mainContent': ItemsComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/item/:id',
    name: 'item',
    meta: {
      title: '商品编辑'
    },
    components: {
      'mainContent': ItemComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/item',
    name: 'createItem',
    meta: {
      title: '创建商品'
    },
    components: {
      'mainContent': ItemComponent,
      'navigation': NavigationComponent
    }
  },
  
  {
    path: '/c/item/:id',
    name: 'copyItem',
    meta: {
      title: '复制商品'
    },
    components: {
      'mainContent': ItemComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/events',
    name: 'events',
    meta: {
      title: '活动管理'
    },
    components: {
      'mainContent': EventsComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/event/:id?/items',
    name: 'eventItems',
    meta: {
      title: '活动商品'
    },
    components: {
      'mainContent': EventItemsComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      title: '账户管理'
    },
    components: {
      'mainContent': AccountComponent,
      'navigation': NavigationComponent
    }
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '用户注册'
    },
    components: {
      'mainContent': RegisterComponent
    }
  }
]
export default config