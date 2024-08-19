import styled from "styled-components";

export const LoaderWrapper = styled.div`
  .mainContainer {
    position: absolute;
    height: 50px;
    width: 135px;
    top: 0;
    right: 0;
    bottom: 0;

    left: 0;
    margin: auto;
    text-align: center;
  }

  div div.ball {
    width: 16px;
    position: relative;
    display: inline-block;
    margin: 5px;
    height: 16px;
    border-radius: 50%;
    z-index: 999;
  }

  .ball-one {
    background-color: red;
    animation: jump 0.5s ease 0s infinite alternate;
  }

  .ball-two {
    background-color: red;
    animation: jump 0.5s ease 0.15s infinite alternate;
  }

  .ball-three {
    background-color: red;
    animation: jump 0.5s ease 0.25s infinite alternate;
  }

  .ball-four {
    background-color: red;
    animation: jump 0.5s ease 0.35s infinite alternate;
  }

  .shadow {
    position: relative;
    opacity: 0.1;
    bottom: 20px;
    width: 20px;
    height: 5px;
    border-radius: 50%;
    background-color: green;
    display: inline-block;
    margin: 5px;
  }

  .shadow-one {
    animation: shrink 0.5s ease 0s infinite alternate;
  }

  .shadow-two {
    animation: shrink 0.5s ease 0.5s infinite alternate;
  }

  .shadow-three {
    animation: shrink 0.5s ease 0.1s infinite alternate;
  }

  .shadow-four {
    animation: shrink 0.5s ease 0.15s infinite alternate;
  }

  @keyframes jump {
    0% {
      transform: scaleY(0.8);
    }
    100% {
      transform: translateY(-20px);
    }
  }

  @keyframes shrink {
    100% {
      transform: scaleX(0.5);
      opacity: 0.01;
    }
  }
`;
