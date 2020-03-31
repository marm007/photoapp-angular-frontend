export const apiURL = 'https://marm007-photo-app.herokuapp.com/api';
export const mediaURL = 'https://res.cloudinary.com/marm007/';
// ng build --prod --output-path docs --base-href /frontend/

export enum ImageType {
  THUMBNAIL = 'c_scale,w_50/',
  SMALL = 'c_scale,w_150/',
  MEDIUM = 'c_scale,w_250/',
  LARGE = 'c_scale,w_500/',
  PROFILE = 'c_scale,h_200/',
  ORIGINAL = '',
}

export function prepareImage(path: string, imageType: ImageType = ImageType.ORIGINAL): string {
  return  mediaURL + path.slice(0, 13) + imageType + path.slice(13,  path.length);
}
