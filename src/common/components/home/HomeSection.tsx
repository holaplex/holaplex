import { FC } from "react";

interface HomeSectionProps {
    title: string;
}

const HomeSection: FC<HomeSectionProps> = props => {
    return <div>
        <h1>{props.title}</h1>
        {props.children}
    </div>;
}

export default HomeSection;