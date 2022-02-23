import React from "react";
import PropTypes from "prop-types";
import { FiUsers, FiTwitter } from "react-icons/fi";
import { AiOutlineLink } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { BiCodeCurly } from "react-icons/bi";
import { RiGithubLine } from "react-icons/ri";

// styles
import s from "./styles.module.css";

const ProfileCard = ({ data }) => {
  return (
    <div className={s.profileCard}>
      <img src={data.avatar_url} alt={data.login} />
      <div className={s.details}>
        <h2>{data.name}</h2>
        <p>{data.bio}</p>
        <ul>
          <li>
            <span>
              <FiUsers className={s.icon} /> Followers :
              <strong> {data.followers}</strong>
            </span>
            <span>
              Following : <strong> {data.following} </strong>
            </span>
          </li>

          {data.location && (
            <li>
              <GoLocation className={s.icon} /> {data.location}
            </li>
          )}

          {data.twitter_username && (
            <li>
              <FiTwitter className={s.icon} />
              <a
                href={`https://twitter.com/${data.twitter_username}`}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{data.twitter_username}</strong>
              </a>
            </li>
          )}

          {data.blog && (
            <li>
              <AiOutlineLink className={s.icon} />
              <a href={`http://${data.blog}`} target="_blank" rel="noreferrer">
                <strong>{data.blog}</strong>
              </a>
            </li>
          )}
          {data.html_url && (
            <li>
              <RiGithubLine className={s.icon} />
              <a href={data.html_url} target="_blank" rel="noreferrer">
                <strong>{data.login}</strong>
              </a>
            </li>
          )}
          {data.hireable && (
            <li>
              <BiCodeCurly className={s.icon} />
              Availble for hire
            </li>
          )}
        </ul>
        <span className={s.note}>
          <em>
            Generated via github. Change data on your github account to see
            changes.
          </em>
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;

ProfileCard.propTypes = {
  data: PropTypes.object,
};
