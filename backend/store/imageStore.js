const validClasses = ['AKIEC', 'BCC', 'BKL', 'DF', 'MEL', 'NV', 'VASC'];
const images = [];

export function addImages(records) {
  const withTimestamp = records.map(({ class: cls, path }) => ({
    class: cls,
    path,
    created_at: new Date()
  }));
  images.push(...withTimestamp);
}

export function getImages(filter = {}, limit = 50) {
  let list = [...images];
  if (filter.class && validClasses.includes(filter.class)) {
    list = list.filter(img => img.class === filter.class);
  }
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list.slice(0, limit);
}
