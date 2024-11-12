import styled from "styled-components";

const AnimatedArrow = ({className}) => {
    return (
        <StyledWrapper>
            <div className={`arrow ${className}`}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .arrow {
        position: absolute;
        top: 87%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* cursor: pointer; */
    }

    .arrow span {
        display: block;
        width: 1.3vw;
        height: 1.3vw;
        border-bottom: 5px solid white;
        border-right: 5px solid white;
        transform: rotate(45deg);
        margin: -10px;
        animation: animate 2s infinite;
    }

    .arrow span:nth-child(2) {
        animation-delay: -0.2s;
    }

    .arrow span:nth-child(3) {
        animation-delay: -0.4s;
    }

    @keyframes animate {
        0% {
            opacity: 0;
            transform: rotate(45deg) translate(-20px, -20px);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: rotate(45deg) translate(20px, 20px);
        }
    }
`;

export default AnimatedArrow;
