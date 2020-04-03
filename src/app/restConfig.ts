import { environment} from '../environments/environment';
import moment from 'moment';

// ng build --prod --output-path docs --base-href /frontend/

export enum ImageType {
  THUMBNAIL = 't_media_lib_thumb/',
  LARGE = 'c_scale,w_600/'
}

export function prepareImage(path: string, imageType: ImageType = ImageType.THUMBNAIL): string {
  if ( path !== null) {
    console.log(path);

    if (path.includes(environment.mediaURLHTTP)) {
      console.log('INCLUDES');
      const index = environment.mediaURLHTTP.length;
      return environment.mediaURL + path.slice(index, index + 13) + imageType + path.slice(index + 13,  path.length);
    }  else if (path.includes(environment.mediaURL)) {
      const index = environment.mediaURL.length;
      return environment.mediaURL + path.slice(index, index + 13) + imageType + path.slice(index + 13,  path.length);
    } else {
      return environment.mediaURL + path.slice(0, 13) + imageType + path.slice(13,  path.length);
    }
  } else {
    return environment.avatarURL;
  }

}

export function   addCorrectTime(created: Date | number | string): string {
  const currentTime = moment();
  const relTime = moment(created);

  const hours = currentTime.diff(relTime, 'hours');
  created = hours + ' hours ago';
  if (hours === 0) {
    const minutes = currentTime.diff(relTime, 'minutes');
    created = minutes + ' minutes ago';
    if (minutes === 0) {
      const seconds = currentTime.diff(relTime, 'seconds');
      created = currentTime.diff(relTime, 'seconds') + ' seconds ago';
      if (seconds === 0) {
        created = 'just now';
      }
    }
  }
  return created;
}


