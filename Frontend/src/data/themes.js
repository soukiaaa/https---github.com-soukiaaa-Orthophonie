// sample data for themes and subcategories

const themes = [
  {
    id: 'animals',
    name: 'الحيوانات',
    image: '/src/assets/images/farm.jfif',
    subcategories: [
      { id: 'farm', name: 'مزرعة', image: '/src/assets/images/farm.jfif' },
      { id: 'wild', name: 'برية', image: '/src/assets/images/wildlife.jfif' },
      { id: 'pets', name: 'حيوانات أليفة', image: '/src/assets/images/pets.jfif' },
    ],
  },
  {
    id: 'food',
    name: 'الطعام',
    image: '/src/assets/images/fruits.jfif',
    subcategories: [
      { id: 'fruits', name: 'فواكه', image: '/src/assets/images/fruits.jfif' },
      { id: 'vegetables', name: 'خضروات', image: '/src/assets/images/vegetables.jfif' },
      { id: 'meals', name: 'وجبات', image: '/src/assets/images/meals.jfif' },
    ],
  },
  {
    id: 'colors',
    name: 'الألوان',
    image: '/src/assets/images/colors.jfif',
    subcategories: [
      { id: 'red', name: 'أحمر', image: '/src/assets/images/red.jfif' },
      { id: 'blue', name: 'أزرق', image: '/src/assets/images/blue.jpg' },
      { id: 'green', name: 'أخضر', image: '/src/assets/images/green.jpg' },
    ],
  },
  {
    id: 'numbers',
    name: 'الأرقام',
    image: '/src/assets/images/numbers.jfif',
    subcategories: [
      { id: 'one', name: 'واحد', image: '/src/assets/images/farm.jfif' },
      { id: 'two', name: 'اثنان', image: '/src/assets/images/farm.jfif' },
      { id: 'three', name: 'ثلاثة', image: '/src/assets/images/farm.jfif' },
    ],
  },
  {
    id: 'body',
    name: 'أجزاء الجسم',
    image: '/src/assets/images/body.jfif',
    subcategories: [
      { id: 'head', name: 'رأس', image: '/src/assets/images/pets.jfif' },
      { id: 'hands', name: 'أيادي', image: '/src/assets/images/pets.jfif' },
      { id: 'feet', name: 'أقدام', image: '/src/assets/images/pets.jfif' },
    ],
  },
  {
    id: 'clothes',
    name: 'الملابس',
    image: '/src/assets/images/clothes.jfif',
    subcategories: [
      { id: 'shirt', name: 'قميص', image: '/src/assets/images/farm.jfif' },
      { id: 'pants', name: 'بنطال', image: '/src/assets/images/farm.jfif' },
      { id: 'shoes', name: 'أحذية', image: '/src/assets/images/farm.jfif' },
    ],
  },
  {
    id: 'furniture',
    name: 'الأثاث',
    image: '/src/assets/images/furniture.jfif',
    subcategories: [
      { id: 'table', name: 'طاولة', image: '/src/assets/images/meals.jfif' },
      { id: 'chair', name: 'كرسي', image: '/src/assets/images/meals.jfif' },
      { id: 'bed', name: 'سرير', image: '/src/assets/images/meals.jfif' },
    ],
  },
  {
    id: 'plants',
    name: 'النباتات',
    image: '/src/assets/images/plants.jfif',
    subcategories: [
      { id: 'flowers', name: 'أزهار', image: '/src/assets/images/vegetables.jfif' },
      { id: 'trees', name: 'أشجار', image: '/src/assets/images/vegetables.jfif' },
      { id: 'grass', name: 'عشب', image: '/src/assets/images/vegetables.jfif' },
    ],
  },
  {
    id: 'weather',
    name: 'الطقس',
    image: '/src/assets/images/weather.jfif',
    subcategories: [
      { id: 'sunny', name: 'مشمس', image: '/src/assets/images/farm.jfif' },
      { id: 'rainy', name: 'ممطر', image: '/src/assets/images/farm.jfif' },
      { id: 'snowy', name: 'ثلجي', image: '/src/assets/images/farm.jfif' },
    ],
  },
  {
    id: 'vehicles',
    name: 'المركبات',
    image: '/src/assets/images/vehicles.jpg',
    subcategories: [
      { id: 'car', name: 'سيارة', image: '/src/assets/images/wildlife.jfif' },
      { id: 'bus', name: 'حافلة', image: '/src/assets/images/wildlife.jfif' },
      { id: 'bike', name: 'دراجة', image: '/src/assets/images/wildlife.jfif' },
    ],
  },
  {
    id: 'school',
    name: 'المدرسة',
    image: '/src/assets/images/school.jfif',
    subcategories: [
      { id: 'pen', name: 'قلم', image: '/src/assets/images/meals.jfif' },
      { id: 'book', name: 'كتاب', image: '/src/assets/images/meals.jfif' },
      { id: 'desk', name: 'مكتب', image: '/src/assets/images/meals.jfif' },
    ],
  },
  {
    id: 'sports',
    name: 'الرياضة',
    image: '/src/assets/images/sport.jfif',
    subcategories: [
      { id: 'football', name: 'كرة القدم', image: '/src/assets/images/pets.jfif' },
      { id: 'swimming', name: 'السباحة', image: '/src/assets/images/pets.jfif' },
      { id: 'running', name: 'الجري', image: '/src/assets/images/pets.jfif' },
    ],
  },
];

export default themes;
