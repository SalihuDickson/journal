import { createSlice } from '@reduxjs/toolkit';
import { FieldPath, FieldValue } from 'firebase/firestore';
import {
  uploadArticle,
  assignTeam,
  updateStatus,
  sendComment,
  uploadVersion,
  updateAbstract,
  updateCateg,
  delArticle,
} from './articleAsyncuThunk';
import {
  ArticleInfoInt,
  CommentInt,
  VerUrlsInt,
  VolCountInt,
} from '../../types';

interface InitialStateInt {
  allArticles: ArticleInfoInt[];
  publishedArticles: ArticleInfoInt[];
  authorArticles: ArticleInfoInt[];
  editorArticles: ArticleInfoInt[];
  reviewerArticles: ArticleInfoInt[];
  isFetchingArticles: boolean;
  isUploadingAritlce: boolean;
  justUploaded: boolean;
  articleError: string;
  articleAppLoading: boolean;
  isFirstEnter: boolean;
  isAssigningTeam: boolean;
  isAssigningTeamFailed: boolean;
  justAssignedTeam: boolean;
  isUpdatingStatus: boolean;
  isUpdatingStatusFailed: boolean;
  justUpdatedStatus: boolean;
  isSendingComment: boolean;
  isUploadingVersion: boolean;
  isVerUploadFailed: boolean;
  justUploadedVer: boolean;
  isUpdatingAbstract: boolean;
  isUpdatingAbstractFailed: boolean;
  justUpdatedAbstract: boolean;
  isUpdatingCateg: boolean;
  isUpdatingCategFailed: boolean;
  justUpdatedCateg: boolean;
  initialLoading: boolean;
  volCount: VolCountInt;
  currentIssue: 0 | 1 | 2 | 3 | 4;
  isFirstArticleFetch: boolean;
  isPublishing: boolean;
  justPublished: boolean;
  categories: string[];
  isPublishingFailed: boolean;
  isDeleting: boolean;
  justDeleted: boolean;
  isDeletingFailed: boolean;
}

const initialState: InitialStateInt = {
  allArticles: [],
  publishedArticles: [],
  authorArticles: [],
  editorArticles: [],
  reviewerArticles: [],
  isFetchingArticles: false,
  isUploadingAritlce: false,
  justUploaded: false,
  articleError: '',
  articleAppLoading: !true,
  isFirstEnter: true,
  isAssigningTeam: false,
  isAssigningTeamFailed: false,
  justAssignedTeam: false,
  isUpdatingStatus: false,
  isUpdatingStatusFailed: false,
  justUpdatedStatus: false,
  isSendingComment: false,
  isUploadingVersion: false,
  isVerUploadFailed: false,
  justUploadedVer: false,
  isUpdatingAbstract: false,
  isUpdatingAbstractFailed: false,
  justUpdatedAbstract: false,
  isUpdatingCateg: false,
  isUpdatingCategFailed: false,
  justUpdatedCateg: false,
  initialLoading: true,
  volCount: { count: 0, year: 0 },
  isFirstArticleFetch: true,
  isPublishing: false,
  justPublished: false,
  isPublishingFailed: false,
  isDeleting: false,
  justDeleted: false,
  isDeletingFailed: false,
  categories: [],
  currentIssue: 0,
};

const versionsSetter = (
  articles: ArticleInfoInt[],
  id: string,
  versions: VerUrlsInt[]
): ArticleInfoInt[] => {
  return articles.map((article) =>
    article.id === id
      ? {
          ...article,
          verUrls: versions,
        }
      : article
  );
};

const commentsSetter = (
  articles: ArticleInfoInt[],
  id: string,
  comments: CommentInt[],
  commentSect: string
): ArticleInfoInt[] => {
  return articles.map((article) =>
    article.id === id
      ? {
          ...article,
          comments: { ...article.comments, [`${commentSect}`]: comments },
        }
      : article
  );
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    resetJustUploaded(state, action) {
      state.justUploaded = false;
    },
    resetArticleError(state, action) {
      state.articleError = '';
    },
    setPublishedArticles(state, action) {
      state.publishedArticles = action.payload;
    },
    setAuthorArticles(state, action) {
      state.authorArticles = action.payload;
    },
    setEditorArticles(state, action) {
      state.editorArticles = action.payload;
    },
    setReviewerArticles(state, action) {
      state.reviewerArticles = action.payload;
    },
    setAllArticles(state, action) {
      state.allArticles = action.payload;
    },
    setArticleLoading(state, action) {
      state.articleAppLoading = action.payload;
    },
    resetIsFirstEnter(state, action) {
      state.isFirstEnter = false;
    },
    setAuthorComments(state, action) {
      const { id, newComments, role } = action.payload;
      const modComments = newComments as CommentInt[];

      switch (role) {
        case 'author':
          state.authorArticles = commentsSetter(
            state.authorArticles,
            id,
            modComments,
            'author'
          );
          break;

        case 'editor':
          state.editorArticles = commentsSetter(
            state.editorArticles,
            id,
            modComments,
            'author'
          );
          break;

        default:
          state.allArticles = state.allArticles.map((article) =>
            article.id === id
              ? {
                  ...article,
                  comments: { ...article.comments, author: modComments },
                }
              : article
          );
          return state;
      }
    },
    setReviewersComments(state, action) {
      const { id, newComments, role } = action.payload;
      const modComments = newComments as CommentInt[];

      switch (role) {
        case 'reviewer':
          state.reviewerArticles = commentsSetter(
            state.reviewerArticles,
            id,
            modComments,
            'reviewers'
          );
          break;

        case 'editor':
          state.editorArticles = commentsSetter(
            state.editorArticles,
            id,
            modComments,
            'reviewers'
          );
          break;

        default:
          state.allArticles = commentsSetter(
            state.allArticles,
            id,
            modComments,
            'reviewers'
          );
          return state;
      }
    },
    setEditorsComments(state, action) {
      const { id, newComments, role } = action.payload;
      const modComments = newComments as CommentInt[];

      switch (role) {
        case 'editor':
          state.editorArticles = commentsSetter(
            state.editorArticles,
            id,
            modComments,
            'editors'
          );
          break;

        default:
          state.allArticles = commentsSetter(
            state.allArticles,
            id,
            modComments,
            'editors'
          );
          return state;
      }
    },
    resetIsAssigningTeamFailed(state, action) {
      state.isAssigningTeamFailed = false;
    },
    resetJustAssignedTeam(state, action) {
      state.justAssignedTeam = false;
    },
    resetJustUpdatedStatus(state, action) {
      state.justUpdatedStatus = false;
    },
    resetIsUpdatingStatusFailed(state, action) {
      state.isUpdatingStatusFailed = false;
    },
    resetIsVerUploadFailed(state, action) {
      state.isVerUploadFailed = false;
    },
    resetIsUpdatingAbstractFailed(state, action) {
      state.isUpdatingAbstract = false;
    },
    resetJustUploadeVer(state, action) {
      state.justUploadedVer = false;
    },
    resetJustUpdatedAbstract(state, action) {
      state.justUpdatedAbstract = false;
    },
    setVersions(state, action) {
      const { versions, role, id } = action.payload;

      const modVersions = versions as VerUrlsInt[];
      switch (role) {
        case 'author':
          state.authorArticles = versionsSetter(
            state.authorArticles,
            id,
            modVersions
          );
          break;
        case 'reviewer':
          state.reviewerArticles = versionsSetter(
            state.reviewerArticles,
            id,
            modVersions
          );
          break;
        case 'editor':
          state.editorArticles = versionsSetter(
            state.editorArticles,
            id,
            modVersions
          );
          break;
        case 'published':
          state.publishedArticles = versionsSetter(
            state.publishedArticles,
            id,
            modVersions
          );
          break;
        default:
          state.allArticles = versionsSetter(
            state.allArticles,
            id,
            modVersions
          );
          return state;
      }
    },
    setInitialLoading(state, action) {
      state.initialLoading = action.payload;
    },
    setVolCount(state, action) {
      state.volCount = action.payload as typeof state.volCount;
    },
    setIsFirstArticleFetch(state, action) {
      state.isFirstArticleFetch = action.payload;
    },
    setIsPublishing(state, action) {
      state.isPublishing = action.payload;
    },
    setJustPublished(state, action) {
      state.justPublished = true;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    resetJustUpdatedCateg(state, action) {
      state.justUpdatedCateg = false;
    },
    resetIsUpdatingCategFailed(state, action) {
      state.isUpdatingCategFailed = false;
    },
    resetJustDeleted(state, action) {
      state.justDeleted = false;
    },
    resetIsDeletingFailed(state, action) {
      state.isDeletingFailed = false;
    },
    setCurrentIssue(state, action) {
      state.currentIssue = action.payload;
    },
    setIsPublishingFailed(state, action) {
      state.isPublishingFailed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadArticle.pending, (state) => {
        state.isUploadingAritlce = true;
      })
      .addCase(uploadArticle.fulfilled, (state, action) => {
        state.isUploadingAritlce = false;
        state.justUploaded = true;
      })
      .addCase(uploadArticle.rejected, (state, error) => {
        state.articleError = error.payload as string;
        console.log('error');
      });
    builder
      .addCase(assignTeam.pending, (state) => {
        state.isAssigningTeam = true;
      })
      .addCase(assignTeam.fulfilled, (state, action) => {
        state.justAssignedTeam = true;
        state.isAssigningTeam = false;
      })
      .addCase(assignTeam.rejected, (state, error) => {
        state.isAssigningTeam = false;
        state.isAssigningTeamFailed = true;
        console.log(error);
      });
    builder
      .addCase(updateStatus.pending, (state) => {
        state.isUpdatingStatus = true;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.justUpdatedStatus = true;
        state.isUpdatingStatus = false;
      })
      .addCase(updateStatus.rejected, (state, error) => {
        state.isUpdatingStatus = false;
        state.isUpdatingStatusFailed = true;
        console.log(error);
      });
    builder
      .addCase(sendComment.pending, (state) => {
        state.isSendingComment = true;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        state.isSendingComment = false;
      })
      .addCase(sendComment.rejected, (state, error) => {
        state.isSendingComment = false;
        console.log(error);
      });
    builder
      .addCase(uploadVersion.pending, (state) => {
        state.isUploadingVersion = true;
      })
      .addCase(uploadVersion.fulfilled, (state, action) => {
        state.isUploadingVersion = false;
        state.justUploadedVer = true;
      })
      .addCase(uploadVersion.rejected, (state, error) => {
        state.isVerUploadFailed = true;
        state.isUploadingVersion = false;
        console.log(error);
      });
    builder
      .addCase(updateAbstract.pending, (state) => {
        state.isUpdatingAbstract = true;
      })
      .addCase(updateAbstract.fulfilled, (state, action) => {
        state.isUpdatingAbstract = false;
        state.justUpdatedAbstract = true;
      })
      .addCase(updateAbstract.rejected, (state, error) => {
        state.isUpdatingAbstract = false;
        state.isUpdatingAbstractFailed = true;
        console.log(error);
      });
    builder
      .addCase(updateCateg.pending, (state) => {
        state.isUpdatingCateg = true;
      })
      .addCase(updateCateg.fulfilled, (state, action) => {
        state.isUpdatingCateg = false;
        state.justUpdatedCateg = true;
      })
      .addCase(updateCateg.rejected, (state, error) => {
        state.isUpdatingCateg = false;
        state.isUpdatingCategFailed = true;
        console.log(error);
      });
    builder
      .addCase(delArticle.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(delArticle.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.justDeleted = true;
      })
      .addCase(delArticle.rejected, (state, error) => {
        state.isDeleting = false;
        state.isDeletingFailed = true;
        console.log(error);
      });
  },
});

export default articleSlice.reducer;
