import React, { useEffect } from 'react';
import { teamInfo } from '../data';
import team from '../assets/team.jpg';

const Team = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section id='team_sect'>
      <div className='center_sect'>
        <h2 className='sect_heading'>Our Team</h2>
        <div className='team_info_wrapper'>
          <div className='img_wrapper'>
            <img src={team} alt={'team image'} />
          </div>
          <div className='team_info'>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Inventore, nemo nesciunt voluptatem excepturi aspernatur harum
              corporis praesentium magni? Saepe nostrum eos earum ipsum maiores,
              non commodi modi voluptas quae distinctio.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Nesciunt, quas? Aperiam quidem, deleniti fugiat laboriosam aut,
              cupiditate consectetur rem dolor cumque voluptatum totam
              consequatur laudantium.
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Inventore, nemo nesciunt voluptatem excepturi aspernatur harum
              corporis praesentium magni? Saepe nostrum eos earum ipsum maiores,
              non commodi modi voluptas quae distinctio.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Nesciunt, quas? Aperiam quidem, deleniti fugiat laboriosam aut,
              cupiditate consectetur rem dolor cumque voluptatum totam
              consequatur laudantium.
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Inventore, nemo nesciunt voluptatem excepturi aspernatur harum
              corporis praesentium magni? Saepe nostrum eos earum ipsum maiores,
              non commodi modi voluptas quae distinctio.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Nesciunt, quas? Aperiam quidem, deleniti fugiat laboriosam aut,
              cupiditate consectetur rem dolor cumque voluptatum totam
              consequatur laudantium.
            </p>
          </div>
        </div>

        <article className='chief_editor_sect'>
          <h2 className='sect_heading'>Chief Editor</h2>

          <div className='wrapper'>
            <div className='img_wrapper'>
              <img src={team} />
            </div>

            <div className='main_info'>
              <header>
                <p className='name'>Prof. Johnbull Myson</p>
                <p className='affil'>University of Cruise</p>
              </header>

              <div className='main_body'>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Voluptatum, id? Natus hic cupiditate eius nostrum officiis
                  veniam, vitae nesciunt earum ipsam, nisi enim fugiat
                  voluptatem pariatur error! Ratione, assumenda aliquam?
                </p>

                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Minima soluta ipsum, rerum rem aspernatur voluptatum.
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className='editors_sect'>
          <h2 className='sect_heading'>Editors</h2>
          <div className='team_card_wrapper'>
            {teamInfo
              .filter((info) => info.task === 'editor')
              .map((info) => (
                <TeamCard info={info} />
              ))}
          </div>
        </article>

        <article className='reviewers_sect'>
          <h2 className='sect_heading'>Reviewers</h2>
          <div className='team_card_wrapper'>
            {teamInfo
              .filter((info) => info.task === 'reviewer')
              .map((info) => (
                <TeamCard info={info} />
              ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Team;

interface TeamCardPropInt {
  info: (typeof teamInfo)[0];
}

const TeamCard: React.FC<TeamCardPropInt> = ({ info }) => {
  return (
    <article
      className='team_card'
      key={info.id}
      style={{ backgroundImage: `url(${info.imgUrl})` }}
    >
      <div className='full_info'>
        <h3 className='name'>{info.name}</h3>
        <p className='title'>{info.title}</p>
        <p className='dept'>{info.dept}</p>
        <p className='school'>{info.school}</p>
        <p className='email'>{info.email}</p>
      </div>

      <div className='part_info'>
        <h3 className='name'>{info.name}</h3>
        <p className='title'>{info.title}</p>
      </div>
    </article>
  );
};
