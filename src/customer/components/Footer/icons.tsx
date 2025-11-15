import React from 'react';

export const ArrowRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const ListingIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385244ac2a9390_ic-listing.svg" alt="Listing" className="w-16 h-16"/>;
export const SaleIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385257a32a938c_ic-sale.svg" alt="Sale" className="w-16 h-16" />;
export const PickupIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e38523c992a938e_ic-pickup.svg" alt="Pickup" className="w-16 h-16"/>;
export const PaidIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e38527a4e2a938f_ic-paid.svg" alt="Paid" className="w-16 h-16" />;
export const ListingEnhancementIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385253812a9391_ic-enhancement.svg" alt="Enhancement" className="w-16 h-16"/>;
export const MarketingIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385289f82a9392_ic-marketing.svg" alt="Marketing" className="w-16 h-16"/>;
export const FairWageIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e38522e862a9395_ic-wage.svg" alt="Fair Wage" className="w-16 h-16"/>;
export const PaymentIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e38524f3f2a9394_ic-payment.svg" alt="Payment" className="w-16 h-16"/>;
export const CustomerExperienceIcon = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385264b32a9393_ic-customer.svg" alt="Customer Experience" className="w-16 h-16"/>;


export const MapIllustration = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5f4410a8e17b2b737f59d293_sell-map.svg" alt="Map of USA with furniture" className="max-w-md w-full" />;

export const DogCouchIllustration = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385248bf2a9446_ill-couch.svg" alt="Dog on a couch" className="max-w-sm w-full" />;


export const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


// Brand Logos (as SVGs for better quality)
export const WestElmLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e38529e842a93de_west-elm.svg" alt="West Elm" className="h-8" />;
export const CrateBarrelLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385248232a93e3_crate-and-barrel.svg" alt="Crate and Barrel" className="h-8" />;
export const PotteryBarnLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e3852119c2a93e0_pottery-barn.svg" alt="Pottery Barn" className="h-8" />;
export const RoomBoardLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e3852a4412a93e1_room-and-board.svg" alt="Room & Board" className="h-8" />;
export const WilliamsSonomaLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385264b32a93e2_williams-sonoma.svg" alt="Williams Sonoma" className="h-8" />;
export const IkeaSvgLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385216662a93df_ikea.svg" alt="Ikea" className="h-8" />;
export const Cb2Logo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e38523c992a93e5_cb2.svg" alt="CB2" className="h-8" />;
export const DwrLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e3852613b2a93e4_dwr.svg" alt="DWR" className="h-8" />;
export const ArticleLogo = () => <img src="https://assets-global.website-files.com/5e4d20913e38521af52a92ac/5e4d20913e385289f82a93dd_article.svg" alt="Article" className="h-8" />;

export const InstagramIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="currentColor"></rect>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" strokeLinecap="round"></line>
    </svg>
);

export const TwitterIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.58-.7-.02-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06 1.9 1.23 4.15 1.95 6.55 1.95 7.85 0 12.17-6.52 12.17-12.17 0-.18 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
    </svg>
);

export const FacebookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
    </svg>
);

export const PinterestIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" >
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.6 7.6 6.2 8.9.1-.4.2-1 .3-1.4l1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.6 2.5-1 3.9-.3 1.1.6 2 1.7 2 2 0 3.6-2.2 3.6-5.3 0-2.8-2-4.8-5-4.8-3.4 0-5.4 2.5-5.4 5.1 0 .9.3 1.9.7 2.4l.3-.9c.1-.5.1-1-.1-1.4-.2-.6-.9-1.2-1.8-1.2-1.5 0-2.5 1.5-2.5 3.3 0 1.2.5 2.2 1.1 2.8l-.3 1.2c-.6 2.1 2 4.6 2.2 4.8.4.2 1.1.1 1.5-.2.5-.4.5-1 .5-1.5 0-.8-.4-1.5-1-2.3z"></path>
    </svg>
);

// Sustainability Icons
export const FactoryIcon = () => (
<svg width="45" height="62" viewBox="0 0 45 62" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M33.04 1.29a9.211 9.211 0 0 0-6.178 5.282 7.42 7.42 0 0 0-9.106 5.744 5.84 5.84 0 0 0-7.828 4.647 4.551 4.551 0 1 0 2.398 5.585 5.835 5.835 0 0 0 8.764-2.495 7.411 7.411 0 0 0 9.799-1.732 9.225 9.225 0 1 0 2.158-17.007l-.007-.025z" fill="#CDEEFD"></path>
<path d="M16.783 27.665H8.956v21.284h7.827V27.665z" fill="#A1D5EC"></path><path d="M16.681 44.04H8.675v8.007h8.008v-8.008z" fill="#404656"></path>
<path d="M33.483 24.072h-7.902v24.584h7.902V24.072z" fill="#A1D5EC"></path><path d="M33.694 42.038h-8.008v8.007h8.008v-8.007z" fill="#404656"></path>
<path d="M40.705 48.043H2.67a2.002 2.002 0 0 0-2.002 2.002v10.01c0 1.105.896 2.001 2.002 2.001h38.036a2.002 2.002 0 0 0 2.002-2.002v-10.01a2.002 2.002 0 0 0-2.002-2.001z" fill="#C1EAFC"></path><path d="M5.643 55.05h33.241" stroke="#404656" stroke-width="1.001" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M20.94 8.005a7.421 7.421 0 0 0-3.319 4.828 5.839 5.839 0 0 0-7.828 4.647 4.55 4.55 0 0 0-6.097 5.925" stroke="#404656" stroke-width="1.001" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
);

export const CarIcon = () => (
    <svg width="60" height="60" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.139 15.437s-.566-4.7 0-5.813C1.705 8.509 5.327 2.853 8.78.864c1.802-1.04 7.73-.845 13.251-.858 5.063-.012 10.06-.012 11.044.573 2.772 1.644 11.597 8.31 12.768 8.488 3.987.609 8.324 2.133 11.947 3.98 1.307.667 2.225.498 2.225 4.608 0 2.224-.042 2.05-.015 3.772.043 2.658-3.276 4.166-5.934 4.166H2.852c-2.07-2.223-4.238-8.749-1.713-10.156z" fill="#C1EAFC"></path>
    <path d="M10.116 30.063a6.445 6.445 0 1 0 0-12.89 6.445 6.445 0 0 0 0 12.89zM47.463 30.063a6.445 6.445 0 1 0 0-12.89 6.445 6.445 0 0 0 0 12.89z" fill="#404656"></path><path d="M14.178 1.015h15.101c1.097 0 2.18.346 3.169 1.013l9.999 7.231c.15.097.096.417-.067.417H11.588c-.58 0-1.142-.315-1.563-.881l-.187-.254c-.921-1.237-.935-3.299-.032-4.56l.528-.738c1.021-1.427 2.406-2.228 3.844-2.228z" fill="#A1D5EC"></path>
    <path d="M25.606 9.105L24.57 1.636M25.982 23.421l-.366-12.076M28.713 12.267h2.68M13.043 12.267h2.678M1.136 15.437c1.61.814 3.464-2.83 3.817-5.171.143-.946-1.611-1.153-3.426-1.034M59.81 17.204s-.87-.03-1.896-.03c-1.529 0-2.03-2.204-1.631-2.5.521-.392 1.956-.194 3.185-.23" stroke="#404656" stroke-width=".834" stroke-miterlimit="10" stroke-linecap="round"></path>
    <path d="M10.12 27.357a3.74 3.74 0 1 0 0-7.478 3.74 3.74 0 0 0 0 7.478zM47.455 27.357a3.74 3.74 0 1 0 0-7.478 3.74 3.74 0 0 0 0 7.478z" fill="#fff"></path>
    </svg>
);

export const TreeIcon = () => (
<svg width="42" height="50" viewBox="0 0 42 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.137 31.683s-1.182 1.678-3.187.53a3.119 3.119 0 0 1-1.49-2.233s-1.58 1.37-3.368.202c-1.27-.829-.885-2.375-1.132-2.521-.531-.31-1.442.266-2.125-.744-.993-1.49-.555-2.88-1.084-3.044-2.14-.672-2.621-3.9-1.732-5.4.338-.566-2.783-2.96-1.062-6.04 1.37-2.479 3.227-2.32 3.719-2.734.491-.414-.914-3.758 3.145-4.967 2.125-.635 3.843.92 4.138.414.797-1.362.531-1.76 1.99-2.372 1.458-.61 2.813.47 2.977.303.165-.167.415-2.069 3.063-2.069s3.719 2.07 4.056 2.237c.337.167.954-.882 2.39-.168.867.428 1.49 1.573 1.49 1.573s.907-1.142 3 .042c1.86 1.063 1.37 2.465 1.86 2.441.796-.037 2.26-.579 3.5.415 1.24.993 1.262 3.49 1.655 3.642 1.081.417 4.053 0 4.056 4.056 0 2.656-1.142 3.405-1.344 3.83-.292.619 1.05 3.745-1.46 6.94-1.005 1.281-2.907.819-2.907 1.563 0 .743.266 2.526-2.345 3.373-2.285.738-2.704-.797-3.119-.31-.414.485-1.679 1.859-3.227 1.84-1.549-.018-2.07-.683-2.07-.683l-9.387-.116z" fill="#C1EAFC"></path>
<path d="M24.059 3.236c.329.165.953-.881 2.39-.167.866.428 1.49 1.573 1.49 1.573s.906-1.143 3.002.042c1.86 1.063 1.37 2.465 1.86 2.441" stroke="#404656" stroke-width=".828" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M12.673 32.251c2.005 1.148 3.187-.531 3.187-.531l9.387.117s.521.664 2.07.683c1.548.018 3.062-1.227 3.476-1.713.414-.486 1.027 1.152 3.312.414 2.61-.848 2.484-2.982 2.484-3.726 0-.744 2.07-.414 2.484-1.242.158-1.457-1.656-1.656-1.242-3.312.414-1.656-1.242-3.312-3.312-4.14-2.07-.828-3.26 1.449-4.554.414-2.07-1.655-3.726-2.897-6.21-2.483-2.505.417-4.913 3.173-5.381 3.725-3.312-4.968-6.7-1.656-7.452-1.656-1.656 0-4.968-2.484-6.624-2.07-1.656.414-2.218 1.214-2.556 1.78-.89 1.5-.409 4.727 1.732 5.4.529.164.09 1.553 1.084 3.044.683 1.009 1.594.433 2.125.743.247.146-.138 1.692 1.131 2.521 1.788 1.169 3.369-.202 3.369-.202a3.119 3.119 0 0 0 1.49 2.234z" fill="#A1D5EC"></path>
<path d="M.968 12.424c1.37-2.478 3.227-2.319 3.719-2.733.49-.415-.914-3.759 3.145-4.967 2.125-.635 3.843.919 4.138.414" stroke="#404656" stroke-width=".828" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M17.895 48.567a.735.735 0 0 0 .59.827c.594.11 1.501.243 2.409.243.926 0 1.879-.139 2.493-.25a.738.738 0 0 0 .6-.81c-.266-2.672-1.109-12.498.617-14.771 2.003-2.638 8.19-8.553 8.19-8.553h-4.37s-2.454 4.914-4.73 4.914c-2.277 0-.638-3.275-.638-3.275l-2.922.18s.82 3.095-.635 3.188c-1.456.093-9.562-9.462-9.562-9.462v4.277s7.825 6.276 8.462 10.827c.53 3.785-.232 10.511-.504 12.665z" fill="#404656"></path>
<path d="M9.44 20.505c-3.43 2.643-.985 3.004-.985 3.004s1.278 3.488 4.418 3.488 2.672.29 3.43 1.918c.756 1.628 4.127 2.151 4.764.757.638-1.395 1.753 2.263 4.112 1.572 1.889-.555 3.504-3.493 3.504-3.493s1.742.874 3.312.41c1.57-.466 3.257-3.374 3.257-3.374s-2.389-4.282-6.115-2.26c0-2.022-5.381-2.898-6.21-1.656-2.897-1.656-5.434-.366-6.625.717-1.707-1.656-5.775-1.92-6.861-1.083z" fill="#A1D5EC"></path><path d="M8.437 23.355s1.277 3.487 4.417 3.487c1.474 0 2.234.075 2.54.3.305.226.488.755.89 1.618.754 1.628 4.4 2.024 5.06.446.185-.443 1.795 2.45 4.066 1.823 1.628-.452 2.86-2.657 3.188-3.273a.18.18 0 0 1 .236-.085c.462.197 1.846.635 3.153.335 2.218-.51 3.256-3.374 3.256-3.374M9.386 16.807c0-.186-.949-1.36.491-2.86 1.44-1.501 3.188-.986 3.472-1.084.284-.098.02-1.02 1.214-1.45a3.254 3.254 0 0 1 1.623 0 .06.06 0 0 0 .074-.058c0-.267.133-1.146 1.658-1.595 1.593-.48 2.39.266 2.39.266M29.564 11.532c1.329.345 1.35 1.328 1.86 1.16 2.082-.653 3.469.896 3.137 2.147-.114.428 2.173 1.131.685 3.634" stroke="#404656" stroke-width=".828" stroke-miterlimit="10" stroke-linecap="round"></path>
</svg>
);