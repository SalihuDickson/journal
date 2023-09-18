import { createContext, useContext, useState, useEffect } from 'react';
import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';
import { EduJournServices } from './services/EduJournServices';
import { toast } from 'react-toastify';
import { useAppSelector } from './app/store';
import { FieldValue } from 'firebase/firestore';
import { ArticleInfoInt, MailEnum, PageSectEnum, StatusEnum } from './types';
import { timeConverter } from './helpers/timeConverter';

// todo DELTE THESE INTERFACES
interface CommentInt {
  senderId: string;
  timestamp: FieldValue;
  msg: string;
  name: string;
  readers: string[];
}

interface allAuthorArticlesInt {
  id: any;
  title: string;
  status: string;
  category: string;
  comments: CommentInt[];
  verUrls: string[];
}

interface ContextInt {
  commentArticleId?: string;
  setCommentArticleId?: React.Dispatch<React.SetStateAction<string>>;
  setStatusArticleId?: React.Dispatch<React.SetStateAction<string>>;
  statusArticleId?: string;
  selectedStatus?: string;
  setSelecetedStatus?: React.Dispatch<React.SetStateAction<string>>;
  versionArticleId?: string;
  setVersionArticleId?: React.Dispatch<React.SetStateAction<string>>;
  authorsArticleId?: string;
  setAuthorsArticleId?: React.Dispatch<React.SetStateAction<string>>;
  reviewersArticleId?: string;
  setReviewersArticleId?: React.Dispatch<React.SetStateAction<string>>;
  verErrorMsg?: string;
  setVerErrorMsg?: React.Dispatch<React.SetStateAction<string>>;
  editorsArticleId?: string;
  setEditorsArticleId?: React.Dispatch<React.SetStateAction<string>>;
  isAddTeam?: boolean;
  setIsAddTeam?: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthors?: boolean;
  setIsAuthors?: React.Dispatch<React.SetStateAction<boolean>>;
  isSettings?: boolean;
  setIsSettings?: React.Dispatch<React.SetStateAction<boolean>>;
  pageSect?: PageSectEnum;
  setPageSect?: React.Dispatch<React.SetStateAction<PageSectEnum>>;
  getVerificationLink?: () => Promise<void>;
  logOut?: () => Promise<void>;
  disableVerBtn?: boolean;
  setDisableVerBtn?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggingOut?: boolean;
  setIsLoggingOut?: React.Dispatch<React.SetStateAction<boolean>>;
  justLoggedOut?: boolean;
  setJustLoggedOut?: React.Dispatch<React.SetStateAction<boolean>>;
  isCategories?: boolean;
  setIsCategories?: React.Dispatch<React.SetStateAction<boolean>>;
  superAppLoading?: boolean;
  setAffirm?: React.Dispatch<
    React.SetStateAction<{ state: boolean; type: string }>
  >;
  affirm?: { state: boolean; type: string };
  setSendMail?: React.Dispatch<
    React.SetStateAction<{
      state: boolean;
      type: MailEnum;
      id?: string;
      refId?: string;
    }>
  >;
  sendMail?: {
    state: boolean;
    type: MailEnum;
    id?: string;
    refId?: string;
  };
  verDisplayArticle?: ArticleInfoInt | null;
  setVerDisplayArticle?: React.Dispatch<
    React.SetStateAction<ArticleInfoInt | null>
  >;
  isReload?: boolean;
  setIsReload?: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmations?: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      msg: string;
      type: string;
    }>
  >;
  confirmations?: {
    isShow: boolean;
    msg: string;
    type: string;
  };
  setDashPageNumber?: React.Dispatch<React.SetStateAction<number>>;
  dashPageNumber?: number;
  setDashStatusFilter?: React.Dispatch<
    React.SetStateAction<StatusEnum | 'all'>
  >;
  dashStatusFilter?: StatusEnum | 'all';
  setDashArticlesPerPage?: React.Dispatch<React.SetStateAction<number>>;
  dashArticlesPerPage?: number;
  grandModArticles?: ArticleInfoInt[];
  setGrandModArticles?: React.Dispatch<React.SetStateAction<ArticleInfoInt[]>>;
  recentDate?: Date;
  setRecentDate?: React.Dispatch<React.SetStateAction<Date>>;
}

// * This enum is for the sections on the dashboard
// * 'all' for 'all articles', 'rev' for articles under rev and 'sub' for articles to be reviewed

const AppContext = createContext<ContextInt>({});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [commentArticleId, setCommentArticleId] = useState('');
  const [statusArticleId, setStatusArticleId] = useState('');
  const [versionArticleId, setVersionArticleId] = useState('');
  const [reviewersArticleId, setReviewersArticleId] = useState('');
  const [authorsArticleId, setAuthorsArticleId] = useState('');
  const [editorsArticleId, setEditorsArticleId] = useState('');
  const [isAddTeam, setIsAddTeam] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [disableVerBtn, setDisableVerBtn] = useState(false);
  const [verErrorMsg, setVerErrorMsg] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthors, setIsAuthors] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [superAppLoading, setSuperAppLoading] = useState(true);
  const [verDisplayArticle, setVerDisplayArticle] =
    useState<ArticleInfoInt | null>(null);
  const [isCategories, setIsCategories] = useState(false);

  const [pageSect, setPageSect] = useState<PageSectEnum>(PageSectEnum.all);
  const eduJournServices = new EduJournServices();

  const [selectedStatus, setSelecetedStatus] = useState('pending');
  const { userAppLoading } = useAppSelector((state) => state.user);
  const { articleAppLoading } = useAppSelector((state) => state.article);

  const [recentDate, setRecentDate] = useState(new Date());

  const [isReload, setIsReload] = useState(false);
  const [sendMail, setSendMail] = useState({
    state: false,
    type: MailEnum.appArt,
  });
  const [confirmations, setConfirmations] = useState({
    isShow: false,
    msg: '',
    type: '',
  });
  const [affirm, setAffirm] = useState({ state: false, type: '' });

  const [dashStatusFilter, setDashStatusFilter] = useState<StatusEnum | 'all'>(
    'all'
  );
  const [dashPageNumber, setDashPageNumber] = useState<number>(1);

  const [dashArticlesPerPage, setDashArticlesPerPage] = useState<number>(10);

  const [grandModArticles, setGrandModArticles] = useState<ArticleInfoInt[]>(
    []
  );

  const getVerificationLink = async () => {
    try {
      setDisableVerBtn(true);
      await eduJournServices.emailVer();
      toast.success('Link sent');
    } catch (error) {
      setVerErrorMsg('too many requests');
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await eduJournServices.logOut();
      setJustLoggedOut(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const recentTime = async () => {
    try {
      await eduJournServices.setTime();
      const data = await eduJournServices.getTime();
      setRecentDate(timeConverter(data.data()?.date.toDate().toString()));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    recentTime();
  }, []);

  const sharedProps: ContextInt = {
    commentArticleId,
    setCommentArticleId,
    statusArticleId,
    setStatusArticleId,
    selectedStatus,
    setSelecetedStatus,
    versionArticleId,
    setVersionArticleId,
    reviewersArticleId,
    setReviewersArticleId,
    editorsArticleId,
    setEditorsArticleId,
    pageSect,
    setPageSect,
    isAddTeam,
    setIsAddTeam,
    isSettings,
    setIsSettings,
    getVerificationLink,
    disableVerBtn,
    setDisableVerBtn,
    verErrorMsg,
    logOut,
    isLoggingOut,
    justLoggedOut,
    setJustLoggedOut,
    superAppLoading,
    verDisplayArticle,
    setVerDisplayArticle,
    isReload,
    setIsReload,
    confirmations,
    setConfirmations,
    setAffirm,
    affirm,
    sendMail,
    setSendMail,
    dashStatusFilter,
    setDashStatusFilter,
    dashPageNumber,
    setDashPageNumber,
    dashArticlesPerPage,
    setDashArticlesPerPage,
    grandModArticles,
    setGrandModArticles,
    isCategories,
    setIsCategories,
    recentDate,
    authorsArticleId,
    setAuthorsArticleId,
    isAuthors,
    setIsAuthors,
  };

  useEffect(() => {
    setSuperAppLoading(userAppLoading || articleAppLoading);
  }, [userAppLoading, articleAppLoading]);

  return (
    <AppContext.Provider value={sharedProps}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
