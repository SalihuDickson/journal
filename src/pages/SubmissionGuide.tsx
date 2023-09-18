import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/store';
import { toast } from 'react-toastify';

// TODO Ensure to review some of the info in the below texts

const SubmissionGuide = () => {
  const { userDetails, isLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toast.info('Login as author to access page', { toastId: 'login_toast' });
    navigate('/login');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id='sub_guide_sect'>
      <div className='center_sect'>
        <h3 className='sect_heading'>Submission Guide</h3>

        <h4>Submit Paper</h4>
        <div className='submit_paper_btn_wrapper'>
          <p>
            Please read the guidelines below before visiting the submit paper
            page
          </p>
          {isLoggedIn && userDetails.role === 'author' ? (
            <Link
              to={`/submissions/author/${userDetails.id}`}
              className='submit_btn'
            >
              Submit paper
            </Link>
          ) : (
            <button className='submit_btn' onClick={handleSubmitClick}>
              Submit paper
            </button>
          )}

          <p>
            The Journal of Education is published three times during the
            calendar year: winter, spring, and fall. Please carefully read the
            guidelines below. For specific questions or inquiries, please email:
            <a href='mailto:lorem@ipsum.dolor'>lorem@ipsum.dolor</a>
          </p>
        </div>

        <div className='submission_instructions'>
          <h4>Manuscript Submission</h4>
          <p>
            The manuscript should represent original work, not published
            previously in print or electronic form. The text should be double
            spaced, in 12 pt. Times New Roman typeface, and introduced with a
            100-word unstructured abstract. The page limit for text is
            approximately 25 pages for Reports of Original Research and
            Explications of Theory, and 10 pages for Reflections (please note
            that the page limit does not include the title page, abstract,
            references, tables, figures, or other supplemental materials). There
            should be a one-inch margin on all sides of an 8 ½ x 11-inch page.
            The manuscript should conform to the style specifications of the
            American Psychological Association as described in the Concise Rules
            of APA Style, Seventh Edition, published by the Association in 2019.
            A reasonable number of clear tables and/or figures may be included
            at the end of the text.
          </p>

          <p>
            Consistent with the policy of anonymous review, the author(s)’
            name(s), role(s), and institutional affiliation(s) should be listed
            only on a cover page that will be removed before the manuscript is
            sent to the reviewers. That cover page should include the name of
            the corresponding author, e-mail and postal addresses, and telephone
            number. References to the author(s)’ previous work should be listed
            as Author(s) in the citations and references. Acknowledgment of
            cooperating scholars or professionals and funding sources should be
            added to the end of the cover page.
          </p>

          <h4>Manuscript Review and Selection</h4>
          <p>
            The corresponding author will receive a notice of receipt of the
            manuscript within two weeks. Once your manuscript is received, it
            will be read by the editors to determine whether it will be sent for
            peer review. If accepted for peer review, authors will receive the
            reviewers’ decision within three months. Four types of decisions are
            made: Accept as submitted, Accept with revisions, Revise and
            resubmit, or Not accepted. All manuscripts will be judged on
            adherence to the Guidelines for Authors, the quality and
            significance of the content, the inclusion of a valid discussion of
            implications for practice in the broader field of education, and the
            clarity and cohesion of the text.
          </p>

          <p>
            Upon acceptance of a manuscript, the author(s) will be expected to
            agree to assign the rights to the copyright to the Journal of
            Education, with the authors retaining broad duplication and
            distribution rights for teaching and related educational uses.
          </p>

          <Link
            to={`/submissions/author/${userDetails.id}`}
            className='submit_btn'
          >
            Submit paper
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubmissionGuide;
