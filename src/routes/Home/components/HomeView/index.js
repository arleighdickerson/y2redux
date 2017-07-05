import React from "react";
import GitHubFeed from './GithubActivity'
import {Skills} from './Portfolio'
import {Link} from "react-router";
import * as defaults from './Defaults'

require('font-awesome/less/font-awesome.less')

const PROFILE_IMG = require('../../../../static/img/profile.png')
const getImgSrc = name => require('../../../../static/img/' + name)

export const HomeView = (props) => {
  const {
    about = null,
    skills = {},
    email = 'youremailhere@mailinator.com',
    website = 'http://www.notawebsite.com',
    residence = 'Somewhere, Planet Earth',
    linkedIn = '#',
    github = '#',
  } = {...defaults, ...props}

  const websiteLinkText = website.replace('http://', '').replace('https://', '')

  return (
    <div className="site-index">
      <header className="header">
        <div className="container">
          <img className="profile-image img-responsive pull-left" src={PROFILE_IMG} alt="Arleigh Dickerson"/>
          <div className="profile-content pull-left">
            <h1 className="name">Arleigh Dickerson</h1>
            <h2 className="desc">Application Developer</h2>
            <ul className="social list-inline">
              <li><a href={linkedIn}><i className="fa fa-linkedin"/></a>
              </li>
              <li><a href={github}><i className="fa fa-github-alt"/></a></li>
            </ul>
          </div>
          <Link className="btn btn-lg btn-primary-outline pull-right" to="/contact">
            <i className="fa fa-paper-plane"/>Contact Me
          </Link>
        </div>
      </header>
      <div className="container sections-wrapper">
        <div className="row">
          <div className="primary col-md-8 col-sm-12 col-xs-12">
            <section className="about section">
              <div className="section-inner">
                <h2 className="heading">About Me</h2>
                <div className="content">
                  {about}
                </div>
              </div>
            </section>

            <section className="latest section">
              <div className="section-inner">
                <h2 className="heading">Latest Projects</h2>
                <div className="content">
                  <div className="content">
                    <div className="item row">
                      <a className="col-md-4 col-sm-4 col-xs-12"
                         href="https://www.aeaweb.org" target="_blank"> <img
                        className="img-responsive project-image"
                        src={getImgSrc('projects/project-aeaweb.jpg')} alt="project name"/>
                      </a>

                      <div className="desc col-md-8 col-sm-8 col-xs-12">
                        <h3 className="title">
                          <a href="https://www.aeaweb.org">
                            American Economic Association Website
                          </a>
                        </h3>
                        <p>
                          I built the data systems and administrative gui for a full-fledged content management system.
                          Features I worked on include content revision control, uploaded asset storage and management,
                          data auditing, site search, user authentication and authorization, integration with legacy
                          applications, and a message passing system for the load-balanced application instances.
                        </p>
                      </div>
                    </div>
                    <div className="item row">
                      <a className="col-md-4 col-sm-4 col-xs-12"
                         href="https://github.com/arleighdickerson/MatasanoCryptoChallenge" target="_blank"> <img
                        className="img-responsive project-image"
                        src={getImgSrc('projects/project-crypto-challenge.jpg')} alt="Matasano Crypto Challenge"/>
                      </a>

                      <div className="desc col-md-8 col-sm-8 col-xs-12">
                        <h3 className="title">
                          <a href="https://github.com/arleighdickerson/MatasanoCryptoChallenge">
                            Matasano Crypto Challenge
                          </a>
                        </h3>

                        <p>
                          The <a href="http://cryptopals.com">Matasano Crypto Challenge</a> is a sequence of
                          cryptography exercises written by the cool folks at <a
                          href="http://matasano.com/">Matasano</a>.
                          I have been working through the challenges in <a
                          href="http://scala-lang.com">Scala</a>. You can view my progress via my <a
                          href="https://github.com/arleighdickerson/MatasanoCryptoChallenge">github
                          repository</a>.
                        </p>
                      </div>
                    </div>
                    <div className="item row">
                      <a className="col-md-4 col-sm-4 col-xs-12" href="assets/pdf/ArleighDickersonPoster.pdf"
                         target="_blank"> <img className="img-responsive project-image"
                                               src={getImgSrc('projects/project-capstone.png')}
                                               alt="Bijective Algorithms"/>
                      </a>

                      <div className="desc col-md-8 col-sm-8 col-xs-12">
                        <h3 className="title">
                          Mathematics Capstone
                        </h3>
                        <p>For my mathematics capstone, I studied proofs of the <a
                          href="http://wikipedia.org/wiki/Hook_length_formula">Hook Length Formula</a>. I
                          wrote a <a href="assets/pdf/ArleighDickersonCapstone.pdf">paper</a> and made a <a
                            href="assets/pdf/ArleighDickersonPoster.pdf">poster</a>. I also wrote some <a
                            href="https://github.com/arleighdickerson/BijectiveAlgorithms">Mathematica
                            programs</a> to investigate the inner workings of the algorithms used in the
                          Novelli Pak Stoyanovskii proof.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/*
             <section className="projects section">
             <div className="section-inner">
             <h2 className="heading">Other Projects</h2>
             <div className="content">
             <div className="item">
             <h3 className="title"><a href="#">Project Title Cras Lacus</a></h3>
             <p className="summary">Provide a brief description of your project. Ut enim ad minima veniam, quis
             nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
             consequatu.</p>
             <p><a className="more-link"
             href="http://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-for-mobile-apps-delta/"
             target="_blank"><i className="fa fa-external-link"/> Find out more</a></p>
             </div>
             <div className="item">
             <h3 className="title"><a href="#">Project Title Cras eget lacus</a> <span
             className="label label-theme">Open Source</span></h3>
             <p className="summary">Provide a brief description of your project. Maecenas ornare ultricies risus,
             in fermentum augue consectetur in. Vestibulum vitae mauris iaculis, sollicitudin velit in,
             molestie nulla. </p>
             <p><a className="more-link"
             href="http://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-for-mobile-apps-delta/"
             target="_blank"><i className="fa fa-external-link"/> View on GitHub</a></p>
             </div>
             <div className="item">
             <h3 className="title"><a href="#">Project Title Maecenas Ornare</a> <span
             className="label label-theme">Open Source</span></h3>
             <p className="summary">Provide a brief description of your project. Lorem ipsum dolor sit amet,
             consectetur adipiscing elit. In vel purus enim. Etiam tortor felis, fermentum ac ultrices sed.</p>
             <p><a className="more-link"
             href="http://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-for-mobile-apps-delta/"
             target="_blank"><i className="fa fa-external-link"/> View on GitHub</a></p>
             </div>
             <a className="btn btn-cta-secondary" href="#">More on CoderWall <i
             className="fa fa-chevron-right"/></a>
             </div>
             </div>
             </section>
             */}
            {/*
             <section className="experience section">
             <div className="section-inner">
             <h2 className="heading">Work Experience</h2>
             <div className="content">
             <div className="item">
             <h3 className="title">Co-Founder & Lead Developer - <span className="place"><a
             href="#">Startup Hub</a></span> <span className="year">(2014 - Present)</span></h3>
             <p>Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus
             in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Donec vitae
             sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus
             tincidunt.</p>
             </div>
             <div className="item">
             <h3 className="title">Software Engineer - <span className="place"><a href="#">Google</a></span>
             <span className="year">(2013 - 2014)</span></h3>
             <p>Vivamus a tortor eu turpis pharetra consequat quis non metus. Aliquam aliquam, orci eu suscipit
             pellentesque, mauris dui tincidunt enim. Sed fringilla mauris sit amet nibh. Donec sodales
             sagittis magna.</p>
             </div>

             <div className="item">
             <h3 className="title">Software Engineer - <span className="place"><a href="#">eBay</a></span> <span
             className="year">(2012 - 2013)</span></h3>
             <p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem
             neque sed ipsum.</p>
             </div>

             </div>
             </div>
             </section>
             */}
            {/*
             <section className="github section">
             <div className="section-inner">
             <h2 className="heading">GitHub Activity</h2>
             <p>You can embed your GitHub contribution graph calendar using IonicaBizau's <a
             href="https://github.com/IonicaBizau/github-calendar" target="_blank">GitHub Calendar</a> widget.
             </p>
             <div id="github-graph" className="github-graph">
             </div>

             <p>You can also embed your GitHub activities using Casey Scarborough's <a
             href="http://caseyscarborough.com/projects/github-activity/" target="_blank">GitHub Activity
             Stream</a> widget.
             </p>
             <GitHubFeed
             fullName={'Arleigh Dickerson'} // Provide Full Name as displayed on GitHub
             username={'arleighdickerson'} // Provide User Name as displayed on Guthub
             avatarUrl={'https://github.com/arleighdickerson.png'} // Provide the avatar url of your github profile
             events={[]}
             />
             </div>
             </section>
             */}
            <section className="github section">
              <div className="section-inner">
                <GitHubFeed
                  fullName={'Arleigh Dickerson'} // Provide Full Name as displayed on GitHub
                  username={'arleighdickerson'} // Provide User Name as displayed on Guthub
                  profileUrl='https://www.github.com/arleighdickerson'
                  avatarUrl={'https://github.com/arleighdickerson.png'} // Provide the avatar url of your github profile
                  events={[]}
                />
              </div>
            </section>
          </div>
          <div className="secondary col-md-4 col-sm-12 col-xs-12">
            <aside className="info aside section">
              <div className="section-inner">
                <h2 className="heading sr-only">Basic Information</h2>
                <div className="content">
                  <ul className="list-unstyled">
                    <li><i className="fa fa-map-marker"/><span className="sr-only">Location:</span>{residence}
                    </li>
                    <li><i className="fa fa-envelope-o"/><span className="sr-only">Email:</span><a
                      href={"mailto:" + email}>{email}</a>
                    </li>
                    <li><i className="fa fa-link"/><span className="sr-only">Website:</span><a
                      href={website}>{websiteLinkText}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/*
             <aside className="testimonials aside section">
             <div className="section-inner">
             <h2 className="heading">Testimonials</h2>
             <div className="content">
             <div className="item">
             <blockquote className="quote">
             <p><i className="fa fa-quote-left"/>James is an excellent software engineer and he is
             passionate about what he does. You can totally count on him to deliver your projects!</p>
             </blockquote>
             <p className="source"><span className="name">Tim Adams</span><br /><span className="title">Curabitur commodo</span>
             </p>
             </div>

             <p><a className="more-link" href="#"><i className="fa fa-external-link"/> More on Linkedin</a></p>
             </div>
             </div>
             </aside>
             */}

            <aside className="education aside section">
              <div className="section-inner">
                <h2 className="heading">Education</h2>

                <div className="content">
                  <div className="item">
                    <h3 className="title">
                      <i className="fa fa-graduation-cap"/> Applied Mathematics B.S.
                    </h3>

                    <h3 className="title">
                      <i className="fa fa-graduation-cap"/> Regents B.A.
                    </h3>

                    <h3 className="title">
                      <i className="fa fa-graduation-cap"/>
                      <small>Integrated Science and Technology (minor)</small>
                    </h3>
                  </div>
                  <h4 className="university">
                    Marshall University <span className="year">(2015)</span>
                  </h4>
                </div>
              </div>
            </aside>
            <Skills {...{...skills}}/>
            {/*
             <aside className="languages aside section">
             <div className="section-inner">
             <h2 className="heading">Languages</h2>
             <div className="content">
             <ul className="list-unstyled">
             <li className="item">
             <span className="title"><strong>English:</strong></span>
             <span className="level">Native Speaker <br className="visible-xs"/><i className="fa fa-star"/> <i
             className="fa fa-star"/> <i className="fa fa-star"/> <i className="fa fa-star"/> <i
             className="fa fa-star"/> </span>
             </li>
             <li className="item">
             <span className="title"><strong>Spanish:</strong></span>
             <span className="level">Professional Proficiency <br className="visible-sm visible-xs"/><i
             className="fa fa-star"/> <i className="fa fa-star"/> <i className="fa fa-star"/> <i
             className="fa fa-star-half"/></span>
             </li>
             </ul>
             </div>
             </div>
             </aside>
             */}
            {/*
             <aside className="blog aside section">
             <div className="section-inner">
             <h2 className="heading">Latest Blog Posts</h2>
             <p>You can use Sascha Depold's <a href="https://github.com/sdepold/jquery-rss" target="_blank">jQuery
             RSS plugin</a> to pull in your blog post feeds.</p>
             <div id="rss-feeds" className="content">
             </div>
             </div>
             </aside>
             */}
            {/*
             <aside className="list music aside section">
             <div className="section-inner">
             <h2 className="heading">Favourite coding music</h2>
             <div className="content">
             <ul className="list-unstyled">
             <li><i className="fa fa-headphones"/> <a href="#">Etiam hendrerit urna nunc</a></li>
             <li><i className="fa fa-headphones"/> <a href="#">Ut sollicitudin in mauris non auctor</a></li>
             <li><i className="fa fa-headphones"/> <a href="#">Etiam hendrerit urna nunc</a></li>
             <li><i className="fa fa-headphones"/> <a href="#">Duis et felis bibendum</a></li>
             </ul>
             </div>
             </div>
             </aside>
             */}
            <aside className="list conferences aside section">
              <div className="section-inner">
                <h2 className="heading">Conferences</h2>

                <div className="content">
                  <ul className="list-unstyled">
                    <li><i className="fa fa-calendar"/> <a href="http://www.securewv.com" target="_blank">Hackercon
                      2014</a></li>
                    <li><i className="fa fa-calendar"/> <a href="http://webdesignday.com" target="_blank">Web Design Day
                      2016</a></li>
                  </ul>
                </div>
              </div>
            </aside>
            {/*
             <aside className="credits aside section">
             <div className="section-inner">
             <h2 className="heading">Credits</h2>
             <div className="content">
             <ul className="list-unstyled">
             <li><a href="http://getbootstrap.com/" target="_blank"><i className="fa fa-external-link"/>
             Bootstrap</a></li>
             <li><a href="http://fortawesome.github.io/Font-Awesome/" target="_blank"><i
             className="fa fa-external-link"/> FontAwesome</a></li>
             <li><a href="http://jquery.com/" target="_blank"><i className="fa fa-external-link"/> jQuery</a>
             </li>
             <li><a href="https://github.com/IonicaBizau/github-calendar" target="_blank"><i
             className="fa fa-external-link"/> GitHub Calendar Plugin</a></li>
             <li><a href="http://caseyscarborough.com/projects/github-activity/" target="_blank"><i
             className="fa fa-external-link"/> GitHub Activity Stream</a></li>
             <li><a href="https://github.com/sdepold/jquery-rss" target="_blank"><i
             className="fa fa-external-link"/> jQuery RSS</a></li>
             <li>Profile image: <a href="https://www.flickr.com/photos/dotbenjamin/2577394151" target="_blank">Ben
             Smith</a></li>
             <li>iPad and iPhone mocks: <a href="https://dribbble.com/perlerar" target="_blank">Regy Perlera</a>
             </li>
             </ul>
             <hr/>
             <p>This responsive portfolio template is handcrafted by UX designer <a
             href="https://www.linkedin.com/in/xiaoying" target="_blank">Xiaoying Riley</a> at <a
             href="http://themes.3rdwavemedia.com/" target="_blank">3rd Wave Media</a> for developers and is
             <strong>FREE</strong> under the <a className="dotted-link"
             href="http://creativecommons.org/licenses/by/3.0/"
             target="_blank">Creative Commons Attribution 3.0 License</a></p>
             <p>We will improve or add new features to this template based on users' feedback so follow us on
             twitter to get notified when a new version is out!</p>
             <a className="btn btn-cta-secondary btn-follow" href="https://twitter.com/3rdwave_themes"
             target="_blank"><i className="fa fa-twitter"/> Follow us</a>
             <a className="btn btn-cta-primary btn-download"
             href="http://themes.3rdwavemedia.com/website-templates/free-responsive-website-template-for-developers/"
             target="_blank"><i className="fa fa-download"/> I want to download</a>
             </div>
             </div>
             </aside>
             */}
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container text-center">
          We stand on the shoulders of <strong><a
          href="http://www.pbm.com/~lindahl/real.programmers.html">giants</a></strong>.
        </div>
      </footer>
    </div>
  )
}
export default HomeView
