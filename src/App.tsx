import React, { useEffect, useState, useRef } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Error from './pages/Error';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Articles from './pages/Articles';
import AuthorDashboard from './pages/components/dashboard/AuthorDashboard';
import EditorDashboard from './pages/components/dashboard/EditorDashboard';
import ReviewerDashboard from './pages/components/dashboard/ReviewerDashboard';
import AuthorSignUp from './pages/AuthorSignUp';
import Login from './pages/Login';
import SingleArticle from './pages/SingleArticle';
import Team from './pages/Team';
import SubmissionsGuide from './pages/SubmissionGuide';
import Submit from './pages/Submit';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/components/dashboard/AdminDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './services/firbase_config';
import { useAppSelector, useAppDispatch } from './app/store';
import { userSlice } from './features/user/userSlice';
import { getUserInfo, registerUser } from './features/user/userAsyncThunk';
import Loading from './pages/Loading';
import Verification from './pages/components/Verification';
import { useGlobalContext } from './context';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {
  EduJournServices,
  articlesColRef,
  usersColRef,
} from './services/EduJournServices';
import { articleSlice } from './features/article/articleSlice';
import { MailEnum, VerUrlsInt, VolCountInt } from './types';
import Confirmations from './pages/components/Confirmations';
import emailjs from '@emailjs/browser';
import {
  getVolumeCount,
  publishArticle,
  updateVolumeCount,
} from './features/article/articleAsyncuThunk';
import { v4 } from 'uuid';
import {
  validateAffil,
  validateDept,
  validateName,
  validateTitle,
} from './helpers/formHandling';

// ! ADD A 'Scroll to Top' BUTTON. DO NOT FORGET

function App() {
  const {
    setTeamInfo,
    resetIsAlreadyAuth,
    resetIsAlreadyReg,
    setUserAppLoading,
  } = userSlice.actions;
  const {
    setPublishedArticles,
    setAuthorArticles,
    setEditorArticles,
    setReviewerArticles,
    setAllArticles,
    setArticleLoading,
    resetIsFirstEnter,
    setIsFirstArticleFetch,
    setVersions,
    setCategories,
    setCurrentIssue,
  } = articleSlice.actions;

  const { sendMail, setSendMail, setIsReload, recentDate } = useGlobalContext();

  const dispatch = useAppDispatch();
  const { isLoggedIn, isAlreadyAuth, isAlreadyReg, userDetails } =
    useAppSelector((state) => state.user);
  const {
    isFirstEnter,
    editorArticles,
    allArticles,
    authorArticles,
    reviewerArticles,
    isFirstArticleFetch,
    publishedArticles,
    categories,
    volCount,
    currentIssue,
  } = useAppSelector((state) => state.article);

  const eduJournServices = new EduJournServices();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!isLoggedIn && sessionStorage.getItem('userRole')) {
          // *This if runs when user reloads page when logged in
          const email = user.email ? user.email : '';
          dispatch(getUserInfo({ email }));
        }
      } else {
        dispatch(setUserAppLoading(false));
      }
    });
  }, []);

  useEffect(() => {
    if (isAlreadyAuth) {
      if (!isAlreadyReg)
        toast.info('User already has password set for the regeistered email');
      dispatch(resetIsAlreadyAuth);
    }

    if (isAlreadyReg) {
      toast.error('Account already exists!');
      dispatch(resetIsAlreadyReg);
    }
  }, [isAlreadyAuth, isAlreadyReg]);

  useEffect(() => {
    let unsubRole: () => void;
    let unsubTeam: () => void;
    if (isLoggedIn) {
      isFirstEnter && dispatch(setArticleLoading(true));

      switch (userDetails.role) {
        case 'author':
          unsubRole = onSnapshot(
            query(
              articlesColRef,
              where('userId', '==', userDetails.id),
              orderBy('createdAt', 'desc')
            ),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toString()
                    : '',
                  publishedAt: articleData.publishedAt
                    ? articleData.publishedAt.toDate().toString()
                    : '',
                });
              });
              setIsReload && setIsReload(true);

              dispatch(setAuthorArticles(articles));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );
          break;

        case 'editor':
          unsubRole = onSnapshot(
            query(
              articlesColRef,
              where('assEditors', 'array-contains', userDetails.id),
              orderBy('createdAt', 'desc')
            ),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toString()
                    : '',
                  publishedAt: articleData.publishedAt
                    ? articleData.publishedAt.toDate().toString()
                    : '',
                });
              });
              setIsReload && setIsReload(true);

              dispatch(setEditorArticles(articles));
            }
          );

          unsubTeam = onSnapshot(
            query(usersColRef, where('role', 'in', ['editor', 'reviewer'])),
            (querySnapshot) => {
              let teamUsers: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const userData = doc.data();
                teamUsers.push(userData);
              });

              dispatch(setTeamInfo(teamUsers));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );
          break;

        case 'reviewer':
          unsubRole = onSnapshot(
            query(
              articlesColRef,
              where('assReviewers', 'array-contains', userDetails.id),
              where('status', '==', 'reviewing'),
              orderBy('createdAt', 'desc')
            ),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toString()
                    : '',
                  publishedAt: articleData.publishedAt
                    ? articleData.publishedAt.toDate().toString()
                    : '',
                });
              });
              setIsReload && setIsReload(true);

              dispatch(setReviewerArticles(articles));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );

          break;

        case 'admin':
          unsubRole = onSnapshot(
            query(articlesColRef, orderBy('createdAt', 'desc')),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toString()
                    : '',
                  publishedAt: articleData.publishedAt
                    ? articleData.publishedAt.toDate().toString()
                    : '',
                });
              });
              setIsReload && setIsReload(true);

              dispatch(setAllArticles(articles));
            }
          );

          unsubTeam = onSnapshot(
            query(usersColRef, where('role', 'in', ['editor', 'reviewer'])),
            (querySnapshot) => {
              let teamUsers: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const userData = doc.data();
                teamUsers.push(userData);
              });

              dispatch(setTeamInfo(teamUsers));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );
          break;

        default:
          unsubRole = () => {};
          return;
      }
    }

    return () => {
      unsubRole?.();
      unsubTeam?.();
    };
  }, [isLoggedIn, userDetails, isFirstEnter]);

  useEffect(() => {
    if (sendMail?.state) {
      let article =
        userDetails.role === 'admin'
          ? allArticles.find((article) => article.id === sendMail.id)!
          : userDetails.role === 'author'
          ? authorArticles.find((article) => article.id === sendMail.id)!
          : editorArticles.find((article) => article.id === sendMail.id)!;

      switch (sendMail.type) {
        case MailEnum.appArt:
          const appProps = {
            article_id: article.id,
            article_title: article.title,
            user_name: userDetails.name,
            author_name: article.author,
            author_email: article.email,
          };

          emailjs
            .send(
              process.env.REACT_APP_EMAIL_SERVICE_ID ?? '',
              process.env.REACT_APP_EMAIL_APPROVAL_TEMPLATE_ID ?? '',
              appProps,
              process.env.REACT_APP_EMAIL_PUBLIC_KEY ?? ''
            )
            .then((response) => {
              toast.info('Approval mail sent');
            })
            .catch((error) => {
              toast.error('Approval mail not sent');
            });
          break;

        case MailEnum.rejArt:
          const rejProps = {
            article_id: article.id,
            article_title: article.title,
            user_name: userDetails.name,
            author_name: article.author,
            author_email: article.email,
          };

          emailjs
            .send(
              process.env.REACT_APP_EMAIL_SERVICE_ID ?? '',
              process.env.REACT_APP_EMAIL_REJECTION_TEMPLATE_ID ?? '',
              rejProps,
              process.env.REACT_APP_EMAIL_PUBLIC_KEY ?? ''
            )
            .then((response) => {
              toast.info('Rejection mail sent');
            })
            .catch((error) => {
              toast.error('Rejection mail not sent');
            });
          break;

        case MailEnum.pubArt:
          const pubProps = {
            article_id: article.id,
            article_title: article.title,
            ref_id: sendMail.refId,
            author_name: article.author,
            author_email: article.email,
          };

          emailjs
            .send(
              process.env.REACT_APP_EMAIL_SERVICE_ID2 ?? '',
              process.env.REACT_APP_EMAIL_PUBLISH_TEMPLATE_ID ?? '',
              pubProps,
              process.env.REACT_APP_EMAIL_PUBLIC_KEY2 ?? ''
            )
            .then((response) => {
              console.log('Publish Email sent successfully:', response);
            })
            .catch((error) => {
              console.error('Publish sending Rejection email:', error);
            });
          break;

        default:
          return;
      }
      setSendMail && setSendMail({ state: false, type: MailEnum.appArt });
    }
  }, [sendMail, setSendMail]);

  useEffect(() => {
    dispatch(getVolumeCount());
  }, [isLoggedIn]);

  useEffect(() => {
    let unsubPub: () => void;
    let unsubCateg: () => void;
    dispatch(setArticleLoading(true));

    // *Published Articles
    unsubPub = onSnapshot(
      query(
        articlesColRef,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      ),
      (querySnapshot) => {
        let articles: DocumentData = [];

        querySnapshot.forEach((doc) => {
          const articleData = doc.data();

          articles.push({
            ...articleData,
            createdAt: articleData.createdAt
              ? articleData.createdAt.toDate().toString()
              : '',
            publishedAt: articleData.publishedAt
              ? articleData.publishedAt.toDate().toString()
              : '',
          });
        });

        dispatch(setPublishedArticles(articles));
        dispatch(setArticleLoading(false));
      }
    );

    // * Categories
    unsubCateg = onSnapshot(
      query(collection(db, 'categories')),
      (querySnapshot) => {
        let categories: DocumentData = [];

        querySnapshot.forEach((doc) => {
          const categoriesData = doc.data();

          categories = [...categoriesData.list];
        });

        dispatch(setCategories(categories));
      }
    );

    return () => {
      unsubPub?.();
      unsubCateg?.();
    };
  }, []);

  useEffect(() => {
    if (volCount.year && recentDate) {
      if (volCount.year < recentDate.getFullYear()) {
        const modVolCount: VolCountInt = {
          count: volCount.count + 1,
          year: recentDate.getFullYear(),
        };

        dispatch(updateVolumeCount(modVolCount));
      }
    }
  }, [volCount, recentDate]);

  useEffect(() => {
    if (recentDate) {
      const month = recentDate.getMonth();
      let currentIssue = 0;
      if (month <= 2) currentIssue = 1;
      if (month > 2 && month <= 5) currentIssue = 2;
      if (month > 5 && month <= 8) currentIssue = 3;
      if (month > 8 && month <= 11) currentIssue = 4;

      dispatch(setCurrentIssue(currentIssue));
    }
  }, [recentDate]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} errorElement={<Error />}>
        <Route index element={<Home />} />
        <Route path='archives' element={<Articles />} />
        <Route path='dashboard' element={<Dashboard />}>
          <Route path='author/:id' element={<AuthorDashboard />} />
          <Route path='editor/:id' element={<EditorDashboard />} />
          <Route path='reviewer/:id' element={<ReviewerDashboard />} />
          <Route path='admin/:id' element={<AdminDashboard />} />
        </Route>
        <Route path='signup' element={<AuthorSignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='article/:id' element={<SingleArticle />} />
        <Route path='our_team' element={<Team />} />
        <Route path='submissions' element={<SubmissionsGuide />} />
        <Route path='submissions/author/:id/' element={<Submit />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

const Root: React.FC = () => {
  const { superAppLoading, confirmations } = useGlobalContext();
  const { setupAcct } = useAppSelector((state) => state.user);
  return (
    <>
      {superAppLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Verification />
          <Outlet />
          <ToastContainer />
          <Confirmations />
          {setupAcct && <SetupAcct />}
          <Footer />
        </>
      )}
    </>
  );
};

const SetupAcct: React.FC = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const deptInputRef = useRef<HTMLInputElement | null>(null);
  const affilInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { resetSetupAcct } = userSlice.actions;

  const { isSignupLoading } = useAppSelector((state) => state.user);

  const resetFields = () => {
    setName('');
    setTitle('');
    setDept('');
    setAffiliation('');

    toast.info('Login again');
    dispatch(resetSetupAcct(''));
  };

  const handleSetUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      validateName(name, nameInputRef.current) &&
      validateTitle(title, titleInputRef.current) &&
      validateDept(dept, deptInputRef.current) &&
      validateAffil(affiliation, affilInputRef.current)
    ) {
      const data = {
        name,
        title,
        email: auth.currentUser?.email ?? '',
        dept,
        affiliation,
        id: v4(),
        role: 'author',
        password: '****',
      };
      dispatch(registerUser({ data, resetFields, isGoogle: true }));
    }
  };

  return (
    <section className='set_acct_sect'>
      <form className='set_acct_form' onSubmit={handleSetUp}>
        <h2 className='title'>Setup Account</h2>

        <div className='form_opts'>
          <div className='form_opt'>
            <input
              type='text'
              placeholder='Fullname (e.g Dr. John Doe)'
              onChange={(e) => setName(e.target.value)}
              value={name}
              ref={nameInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Academic title (e.g Professor)'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              ref={titleInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Department'
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              ref={deptInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder='Affiliation'
              ref={affilInputRef}
            />
          </div>
        </div>
        <button
          className='submit_btn'
          style={
            isSignupLoading
              ? {
                  opacity: '0.5',
                  cursor: 'not-allowed',
                }
              : {}
          }
          disabled={isSignupLoading}
        >
          {isSignupLoading ? 'Setting Up...' : 'Set Up'}
        </button>
      </form>
    </section>
  );
};
