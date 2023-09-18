import { getDownloadURL, getMetadata, updateMetadata } from 'firebase/storage';
import { EduJournServices } from '../services/EduJournServices';

const eduJournServices = new EduJournServices();

export const uploadImg = (file: File, id: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const uploadTask = eduJournServices.uploadImg(id, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (downloadURL) resolve(downloadURL);
          else reject('Avi upload failed');
        });
      }
    );
  });
};

export const uploadFile = (
  file: File,
  id: string,
  isMain = false,
  title = '',
  subUrls?: string[]
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const uploadTask = eduJournServices.uploadFile(id, file, isMain, title);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (downloadURL) {
            subUrls && subUrls.push(downloadURL);
            resolve(downloadURL);
          } else reject('Avi upload failed');
        });

        console.log('suburls in: ', subUrls);

        updateMetadata(uploadTask.snapshot.ref, {
          contentDisposition: `attachment; filename*=utf-8''${file.name}`,
        }).then((metadata) => {});
      }
    );
  });
};
