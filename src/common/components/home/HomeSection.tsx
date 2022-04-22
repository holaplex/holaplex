import { FC } from "react";
import { ChevronRight } from "../icons/ChevronRight";

type Header = FC;
type Title = FC;
type HeaderAction<T> = FC<T>;
type Body = FC;

type HomeSectionSubtypes = {
    Header: Header;
    Title: Title;
    HeaderAction: HeaderAction<HeaderActionProps>;
    Body: Body;
}


/**
 * Compound component for preview sections in the v2 homepage. Contains a title,
 * call to action, and body, e.g.
 * 
 * ```
 *  <HomeSection>
 *      <HomeSection.Header>
 *          <HomeSection.Title>Holaplex Preview</HomeSection.Title>
 *          <HomeSection.HeaderAction newTab href="www.holaplex.com">Go home</HomeSection.HeaderAction>
 *      </HomeSection.Header>
 *      <HomeSection.Body>
 *          <SomeAmazingCustomContent/>
 *      </HomeSection.Body>
 *  </HomeSection>
 * ```
 */
const HomeSection: FC & HomeSectionSubtypes = ({children}) => (
    <div className="w-full border border-white">
        {children}
    </div>
);


const HomeSectionHeader: Header = ({ children }) => (
    <div className="flex flex-row justify-between items-center p-2 border-b border-gray-800 mb-8">
        {children}
    </div>
);
HomeSection.Header = HomeSectionHeader;


const HomeSectionTitle: Title = ({ children }) => <span className="text-lg font-medium text-white">{children}</span>;
HomeSection.Title = HomeSectionTitle;


interface HeaderActionProps {
    href: string;
    newTab?: boolean;
}


const HomeSectionHeaderAction: HeaderAction<HeaderActionProps> = ({ href, newTab, children }) => (
    <a 
        href={href} 
        target={newTab ? "_blank" : undefined}  
        rel="noreferrer" 
        className="text-sm text-gray-300 stroke-gray-300 hover:stroke-white font-medium flex flex-nowrap items-center hover:scale-105 hover:transition"
    >
        {children}
        {/* using stroke class above to color same as text and change on hover */}
        <ChevronRight color=""/>
    </a>
);
HomeSection.HeaderAction = HomeSectionHeaderAction;


const HomeSectionBody: Body = ({ children }) => <div>{children}</div>;
HomeSection.Body = HomeSectionBody;

export default HomeSection;