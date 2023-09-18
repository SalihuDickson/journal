import { ArticleInfoInt, VolCountInt } from './../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EduJournServices } from '../../services/EduJournServices';
import { uploadFile } from '../../helpers/firebaseFunctions';
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import {
  AssingTeamPayloadInt,
  DataInt,
  FormDataInt,
  ModVerDataInt,
  SendCommentPayloadInt,
  StatusEnum,
} from '../../types';
import { articleSlice } from './articleSlice';
import { RootState } from '../../app/store';
import { db } from '../../services/firbase_config';
import { log } from 'console';

const eduJournServices = new EduJournServices();

// *Upload Article
export const uploadArticle = createAsyncThunk<void, FormDataInt>(
  'article/uploadArticle',
  async (payload, thunkApi) => {
    const { id } = payload;
    let subUrls: string[] = [];
    try {
      if (payload.subFiles.length && typeof payload.subFiles !== 'string') {
        for (let i = 0; i < payload.subFiles.length; i++) {
          await uploadFile(payload.subFiles[i], id, false, '', subUrls);
        }
      }

      //* upload main file
      const mainUrl = payload.mainFile
        ? await uploadFile(payload.mainFile, id, true, 'main')
        : '';

      // todo set vol from the information stored in the volume collection

      // * upload article info
      const data: DataInt = {
        id,
        author: payload.author,
        affiliation: payload.affiliation,
        abstract: payload.abstract,
        category: payload.category,
        title: payload.title,
        status: StatusEnum.sub,
        createdAt: serverTimestamp(),
        userId: payload.userId,
        publishedAt: '',
        assReviewers: [],
        assEditors: [],
        email: payload.email,
        vol: 0,
        coAuthors: payload.coAuthors,
        issue: 0,
      };

      const verUrlData: ModVerDataInt = {
        mainUrl,
        subUrls,
        timestamp: serverTimestamp(),
      };

      await eduJournServices.setArticleInfoBasic(data);
      await eduJournServices.setArticleInfoVer(verUrlData, id);
    } catch (error) {
      thunkApi.rejectWithValue(`Article upload ${error}`);
    }
  }
);

// *Assign Team
export const assignTeam = createAsyncThunk<void, AssingTeamPayloadInt>(
  'article/assignTeam',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.assignTeam(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(`Team assign ${error}`);
    }
  }
);

// * Update Status
export const updateStatus = createAsyncThunk<
  void,
  { status: string; articleId: string }
>('article/updateStatus', async (payload, thunkApi) => {
  try {
    await eduJournServices.updateStatus(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(`Status update ${error}`);
  }
});

// *Send Comments
export const sendComment = createAsyncThunk<void, SendCommentPayloadInt>(
  'article/sendComment',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.setComment(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(`Comment sending ${error}`);
    }
  }
);

// *Upload New Version
export const uploadVersion = createAsyncThunk<
  void,
  { mainFile: '' | File; subFiles: [] | FileList | ''; id: string }
>('article/uploadVer', async (payload, thunkApi) => {
  const { id } = payload;
  let subUrls: string[] = [];

  try {
    if (payload.subFiles.length && typeof payload.subFiles !== 'string') {
      for (let i = 0; i < payload.subFiles.length; i++) {
        await uploadFile(payload.subFiles[i], id, false, '', subUrls);
      }
    }

    console.log('suburls ut: ', subUrls);

    //* upload main file
    const mainUrl = payload.mainFile
      ? await uploadFile(payload.mainFile, id, true, 'main')
      : '';

    const verUrlData: ModVerDataInt = {
      mainUrl,
      subUrls,
      timestamp: serverTimestamp(),
    };

    await eduJournServices.setArticleInfoVer(verUrlData, id);
  } catch (error) {
    return thunkApi.rejectWithValue(`Version uploading ${error}`);
  }
});

// * Update Abstract
export const updateAbstract = createAsyncThunk<
  void,
  { abstract: string; articleId: string }
>('article/updateAbstract', async (payload, thunkApi) => {
  try {
    await eduJournServices.updateAbsract(payload);
  } catch (error) {
    thunkApi.rejectWithValue(`Updating Abstrat ${error}`);
  }
});

// * Get Volume Count
export const getVolumeCount = createAsyncThunk<void, void>(
  'article/getVolumeCount',
  async (payload, thunkApi) => {
    const { setVolCount } = articleSlice.actions;
    try {
      const q = query(collection(db, 'volume_count'));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const itemData = doc.data();

          const count: VolCountInt = itemData as VolCountInt;

          thunkApi.dispatch(setVolCount(count));
        });
      });
    } catch (error) {
      thunkApi.rejectWithValue(`Volume count ${error}`);
    }
  }
);

// * Update Volume Count
export const updateVolumeCount = createAsyncThunk<void, VolCountInt>(
  'article/updateVolumeCount',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.setVolumeCount(payload);
    } catch (error) {
      thunkApi.rejectWithValue(`Updating volume ocunt ${error}`);
    }
  }
);

// * Publish Article
export const publishArticle = createAsyncThunk<void, ArticleInfoInt>(
  'article/publishArticle',
  async (payload, thunkApi) => {
    const { setIsPublishingFailed } = articleSlice.actions;

    try {
      const volCount = (thunkApi.getState() as RootState).article.volCount;
      await eduJournServices.publishArticle(
        payload.id,
        volCount.count,
        (thunkApi.getState() as RootState).article.currentIssue
      );
    } catch (error) {
      thunkApi.dispatch(setIsPublishingFailed(true));
      console.log(`Article publishing ${error}`);
    }
  }
);

// * Update Categories
export const updateCateg = createAsyncThunk<void, string[]>(
  'article/updateCateg',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.updateCategories(payload);
    } catch (error) {
      thunkApi.rejectWithValue(`Updating categories ${error}`);
    }
  }
);

// * Delete Article
export const delArticle = createAsyncThunk<void, string>(
  'article/delArticle',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.delArticle(payload);
    } catch (error) {
      thunkApi.rejectWithValue(`Deleting Article ${error}`);
    }
  }
);
