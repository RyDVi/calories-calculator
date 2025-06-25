import { path } from 'static-path';

const root = path('/');

const products = root.path('/products');
const product = products.path('/:product_id');
const productNew = products.path('/new');
const productSendBug = product.path('/send_bug');

const diary = root.path('/diary');
const diaryDetail = diary.path('/:diary_date');

const mealTime = diaryDetail.path('/meal_time/:meal_time_name');
const mealTimeEdit = mealTime.path('/:meal_time_id');

const profile = root.path('/profile');

const statistics = root.path('/statistics');

const auth = profile.path('/auth');

const privacy = root.path('/privacy');

const paths = {
  root,
  products,
  product,
  productNew,
  diary,
  mealTimeEdit,
  profile,
  statistics,
  diaryDetail,
  auth,
  productSendBug,
  privacy,
};

Object.freeze(paths);

export default paths;
