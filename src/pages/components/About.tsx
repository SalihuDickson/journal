import React from 'react';
import aboutUsImg from '../../assets/About.jpg';
import aimsImg from '../../assets/Aims.jpg';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section id='about_sect' className='center_sect'>
      <h2 className='sect_heading'>About us</h2>

      <div className='brief_wrapper'>
        <div className='img_wrapper'>
          <img src={aboutUsImg} alt='about us image' />
        </div>

        <div className='brief_info_wrapper'>
          <h4 className='about_heading'>
            A Brief Introduction
            <hr />
          </h4>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit quos
            quam veritatis ullam ex placeat tenetur aliquam quidem odio. Culpa
            eos temporibus aperiam sapiente? Voluptates natus consequuntur atque
            voluptatibus soluta maxime vitae qui voluptatum fugiat laudantium
            doloribus quae sapiente earum consectetur sunt modi maiores, optio,
            laboriosam odio magni neque sequi!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fuga
            modi possimus laborum voluptatem, consequatur molestiae sunt
            perferendis, odio ipsam ab maiores distinctio inventore voluptas.
            Impedit consequuntur aut itaque, quam non corrupti illum sapiente
            aspernatur aliquid officia explicabo cupiditate incidunt doloremque
            voluptas, est at molestiae quibusdam? Commodi enim, aliquid nam
            culpa optio in autem quisquam a odit incidunt cupiditate minima.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus
            rerum magnam, fugiat, reiciendis nesciunt mollitia dicta temporibus
            deserunt quos in, fugit cumque atque expedita repellendus vel
            accusantium? Quis modi excepturi fugit temporibus, asperiores
            adipisci voluptas ullam sint, quaerat ut nostrum harum placeat
            officia odit ex reiciendis debitis porro iste unde impedit veritatis
            possimus consectetur omnis facere? Necessitatibus?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            magni est nesciunt inventore, unde repellat blanditiis debitis
            ducimus, perspiciatis iste rem. Veniam quos quibusdam quae incidunt
            tenetur molestiae sed vel veritatis fuga. Tempora libero explicabo,
            iste aspernatur rerum repellat necessitatibus mollitia voluptatibus
            accusantium provident vero eius quasi! Soluta, amet accusamus!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus
            rerum magnam, fugiat, reiciendis nesciunt mollitia dicta temporibus
            deserunt quos in, fugit cumque atque expedita repellendus vel
            accusantium? Quis modi excepturi fugit temporibus, asperiores
            adipisci voluptas ullam sint, quaerat ut nostrum harum placeat
            officia odit ex reiciendis debitis porro iste unde impedit veritatis
            possimus consectetur omnis facere? Necessitatibus?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            magni est nesciunt inventore, unde repellat blanditiis debitis
            ducimus, perspiciatis iste rem. Veniam quos quibusdam quae incidunt
            tenetur molestiae sed vel veritatis fuga. Tempora libero explicabo,
            iste aspernatur rerum repellat necessitatibus mollitia voluptatibus
            accusantium provident vero eius quasi! Soluta, amet accusamus!
          </p>
        </div>
      </div>

      <div className='aims_wrapper'>
        <div className='img_wrapper'>
          <img src={aimsImg} alt='about our aims image' />
        </div>

        <div className='aims_info_wrapper'>
          <h4 className='about_heading'>
            Our Aims
            <hr />
          </h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
            libero, nihil a non explicabo quaerat voluptas debitis autem
            consequatur nulla iusto fugit aliquam nobis quod.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Exercitationem, porro eos! Pariatur consectetur commodi tenetur odit
            eum. Facilis, error optio ullam minima neque exercitationem
            voluptas, sit repellat eligendi in dolorem?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
            libero, nihil a non explicabo quaerat voluptas debitis autem
            consequatur nulla iusto fugit aliquam nobis quod.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Exercitationem, porro eos! Pariatur consectetur commodi tenetur odit
            eum. Facilis, error optio ullam minima neque exercitationem
            voluptas, sit repellat eligendi in dolorem?
          </p>
        </div>
      </div>

      {/* <Link to='/our_team'>Meet our team</Link> */}
    </section>
  );
};

export default About;
