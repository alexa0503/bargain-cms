import LoginComponent from './components/Login.vue'
import IndexComponent from './components/Index.vue'
import NavigationComponent from './components/Navigation.vue'
import ItemsComponent from './components/Items.vue'
import ItemComponent from './components/Item.vue'
import ShopsComponent from './components/Shops.vue'
import UsersComponent from './components/Users.vue'
import SettingComponent from './components/Setting.vue'
import BargainsComponent from './components/Bargains.vue'


var config = [{
    path: '/login',
    name: 'login',
    meta: {
      title: '登陆'
    },
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
  }
]
export default config