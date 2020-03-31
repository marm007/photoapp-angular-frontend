import { environment} from '../environments/environment';

// ng build --prod --output-path docs --base-href /frontend/

export enum ImageType {
  THUMBNAIL = 't_media_lib_thumb/',
  SMALL = 't_media_lib_thumb/',
  MEDIUM = 't_media_lib_thumb/',
  LARGE = 'c_scale,w_600/',
  PROFILE = 't_media_lib_thumb/',
  ORIGINAL = 't_media_lib_thumb/',
}

// }
// export enum ImageType {
//   THUMBNAIL = 'c_scale,w_100/',
//   SMALL = 'c_scale,w_200/',
//   MEDIUM = 'c_scale,w_300/',
//   LARGE = 'c_scale,w_600/',
//   PROFILE = 'c_scale,h_200/',
//   ORIGINAL = 'c_scale,w_600/',
// }

export function prepareImage(path: string, imageType: ImageType = ImageType.THUMBNAIL): string {
  return  environment.mediaURL + path.slice(0, 13) + imageType + path.slice(13,  path.length);
}
