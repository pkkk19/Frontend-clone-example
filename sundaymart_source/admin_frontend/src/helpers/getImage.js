import { IMG_URL } from '../configs/app-global';
import placeholder from '../assets/images/placeholder.jpeg';

export default function getImage(url) {
  if (!url) {
    return placeholder;
  }
  return IMG_URL + url;
}
