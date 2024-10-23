// const Temp = () => {
//     return (
//         <div className="border-shadow">
//             <div className="tour-price">
//                 <div className="price--oldPrice">
//                     <h4>Giá:</h4>
//                     <div className="price--discount"></div>
//                 </div>
//                 <div className="price">
//                     <p>
//                         11.990.000&nbsp;₫<span> / Khách</span>
//                     </p>
//                 </div>
//             </div>
//             <div className="tour-price--info">
//                 <div className="tour-price--info__content">
//                     <div className="tour-price--info__content__item">
//                         <div className="label">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="24"
//                                 height="24"
//                                 fill="none"
//                             >
//                                 <path
//                                     fill="#000"
//                                     d="M21.704 12.393h-.383a.58.58 0 0 1-.58-.577.58.58 0 0 1 .58-.577h.383a.295.295 0 0 0 .296-.294V9.18a.295.295 0 0 0-.296-.294h-.383a.58.58 0 0 1-.58-.577v-.107l.433-.395A.29.29 0 0 0 21.2 7.4l-1.155-1.339a.297.297 0 0 0-.418-.032l-.29.247a.585.585 0 0 1-.82-.062.57.57 0 0 1 .064-.814l.29-.247a.29.29 0 0 0 .032-.414l-1.155-1.34a.3.3 0 0 0-.418-.032l-.29.248a.58.58 0 0 1-.423.137.58.58 0 0 1-.397-.2l-.388-.45a.297.297 0 0 0-.417-.031l-5.118 4.354H9.45a.295.295 0 0 0-.296.294c0 .162.132.294.296.294h10.697v.297a1.17 1.17 0 0 0 1.173 1.165h.087v1.176h-.087a1.17 1.17 0 0 0-1.173 1.165 1.17 1.17 0 0 0 1.173 1.164h.087v1.176h-.087a1.17 1.17 0 0 0-1.173 1.165v.666h-2.047a.295.295 0 0 0-.296.294c0 .163.133.294.296.294h2.343a.295.295 0 0 0 .296-.294v-.96a.58.58 0 0 1 .581-.577h.383A.295.295 0 0 0 22 14.45v-1.763a.295.295 0 0 0-.296-.294M11.206 7.425l4.368-3.717.195.226c.204.237.489.38.801.404s.616-.074.854-.277l.066-.056.77.893-.066.056a1.16 1.16 0 0 0-.127 1.642 1.18 1.18 0 0 0 1.654.127l.066-.056.654.758zM15.503 15.987H3.852v-.297a1.17 1.17 0 0 0-1.173-1.165h-.087v-1.176h.087a1.17 1.17 0 0 0 1.173-1.165 1.17 1.17 0 0 0-1.173-1.164h-.087V9.844h.087a1.17 1.17 0 0 0 1.173-1.165v-.666H7.23a.295.295 0 0 0 .296-.294.295.295 0 0 0-.296-.294H3.556a.295.295 0 0 0-.296.294v.96a.58.58 0 0 1-.581.577h-.383A.295.295 0 0 0 2 9.55v1.763c0 .163.132.294.296.294h.383a.58.58 0 0 1 .58.577.58.58 0 0 1-.58.577h-.383a.295.295 0 0 0-.296.294v1.764c0 .162.132.294.296.294h.383a.58.58 0 0 1 .58.577v.159l-.417.33a.293.293 0 0 0-.041.42l1.155 1.34a.296.296 0 0 0 .418.032l.29-.247c.118-.1.268-.15.423-.138A.575.575 0 0 1 5.42 18.6l-.29.247a.29.29 0 0 0-.032.415L6.253 20.6a.297.297 0 0 0 .418.032l.29-.248a.58.58 0 0 1 .82.063l.387.45a.296.296 0 0 0 .418.031l5.11-4.346.007-.008h1.8a.295.295 0 0 0 .295-.294.295.295 0 0 0-.295-.294m-7.077 4.304-.195-.225a1.17 1.17 0 0 0-.801-.404 1.17 1.17 0 0 0-.854.277l-.065.056-.77-.893.065-.056c.238-.202.382-.485.406-.795A1.168 1.168 0 0 0 5.132 17a1.17 1.17 0 0 0-.853.277l-.066.056-.654-.758h9.235z"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     d="M18.715 8.803h-8.433a.295.295 0 0 0-.297.294c0 .162.133.294.297.294h8.137v5.218H5.58V9.391H8.02a.295.295 0 0 0 .296-.294.295.295 0 0 0-.296-.294H5.285a.295.295 0 0 0-.296.294v5.806c0 .163.133.294.296.294h13.43a.295.295 0 0 0 .296-.294V9.097a.295.295 0 0 0-.296-.294"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     d="M8.12 10.713H6.485c-.108 0-.158.116-.158.223 0 .123.058.226.158.226h.568v2.2c0 .103.124.157.252.157.123 0 .25-.054.25-.158v-2.199h.565c.1 0 .159-.107.159-.226 0-.107-.05-.223-.159-.223M8.804 10.713c-.127 0-.251.046-.251.154v2.494c0 .104.124.158.251.158.124 0 .251-.054.251-.158v-2.494c0-.108-.127-.154-.25-.154M11.05 12.536c-.132 0-.24.039-.248.158-.011.16-.042.41-.394.41-.266 0-.413-.142-.413-.441v-1.07c0-.3.147-.442.406-.442.367 0 .394.26.401.38.004.115.109.157.252.157.17 0 .25-.046.25-.245 0-.446-.382-.73-.92-.73-.486 0-.892.238-.892.88v1.07c0 .64.402.879.89.879.54 0 .923-.296.923-.76 0-.196-.081-.246-.255-.246M13.531 13.2l-.843-1.274.692-.86a.15.15 0 0 0 .031-.095c0-.127-.162-.258-.29-.258a.16.16 0 0 0-.139.073l-.835 1.129v-1.048c0-.108-.127-.154-.25-.154-.129 0-.252.046-.252.154v2.494c0 .104.124.158.251.158.124 0 .251-.054.251-.158v-.752l.21-.26.726 1.093a.2.2 0 0 0 .174.096c.146 0 .301-.127.301-.25a.15.15 0 0 0-.027-.088M15.375 13.081H14.28v-.771h.587c.108 0 .159-.104.159-.192 0-.104-.058-.2-.159-.2h-.587v-.767h1.094c.1 0 .158-.104.158-.223 0-.103-.05-.215-.158-.215h-1.376c-.113 0-.22.054-.22.158v2.49c0 .104.107.158.22.158h1.376c.108 0 .158-.112.158-.215 0-.12-.058-.223-.158-.223M17.435 10.713H15.8c-.109 0-.159.116-.159.223 0 .123.058.226.159.226h.568v2.2c0 .103.124.157.251.157.124 0 .251-.054.251-.158v-2.199h.565c.1 0 .158-.107.158-.226 0-.107-.05-.223-.158-.223"
//                                 ></path>
//                             </svg>
//                             <p>
//                                 Mã tour: <span>NNSGN270-027-231024VJ-V-F</span>
//                             </p>
//                         </div>
//                     </div>
//                     <div className="tour-price--info__content__item">
//                         <div className="label">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="24"
//                                 height="24"
//                                 fill="none"
//                             >
//                                 <path
//                                     fill="#000"
//                                     d="M12.04 3.563a.4.4 0 0 0-.415.388.4.4 0 0 0 .41.393.4.4 0 0 0 .414-.388.4.4 0 0 0-.409-.393M12.022 5.906c-1.59-.01-2.892 1.206-2.904 2.714s1.271 2.744 2.86 2.755h.023c1.579 0 2.87-1.213 2.881-2.714.012-1.507-1.271-2.743-2.86-2.755M12 10.594h-.015c-1.136-.008-2.052-.891-2.044-1.968.009-1.072.93-1.938 2.059-1.938h.015c1.136.008 2.052.89 2.044 1.967-.009 1.072-.93 1.939-2.059 1.939M13.797 3.859a.42.42 0 0 0-.526.238.386.386 0 0 0 .25.498c1.814.61 3.023 2.249 3.008 4.078a.4.4 0 0 0 .409.394h.003c.226 0 .41-.173.412-.388.017-2.162-1.412-4.1-3.556-4.82"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     d="M14.526 16.705c2.74-3.344 4.45-5.088 4.474-8.014C19.029 5.009 15.88 2 12 2 8.163 2 5.03 4.946 5 8.59c-.023 3.006 1.72 4.748 4.478 8.114C6.734 17.094 5 18.07 5 19.266c0 .8.78 1.519 2.197 2.023 1.29.458 2.995.711 4.803.711s3.514-.253 4.803-.711C18.22 20.785 19 20.066 19 19.266c0-1.195-1.733-2.172-4.474-2.561M5.824 8.597C5.849 5.38 8.615 2.78 11.999 2.78c3.425 0 6.203 2.656 6.177 5.904-.022 2.778-1.837 4.49-4.734 8.074A77 77 0 0 0 12 18.594a74 74 0 0 0-1.438-1.834c-3.018-3.734-4.762-5.316-4.74-8.162M12 21.219c-3.535 0-6.176-1.031-6.176-1.953 0-.684 1.579-1.548 4.234-1.847.587.73 1.101 1.394 1.606 2.072a.42.42 0 0 0 .336.165.42.42 0 0 0 .336-.164c.5-.67 1.028-1.35 1.61-2.073 2.653.3 4.23 1.163 4.23 1.847 0 .922-2.641 1.953-6.176 1.953"
//                                 ></path>
//                             </svg>
//                             <p>
//                                 Khởi hành: <span>TP. Hồ Chí Minh</span>
//                             </p>
//                         </div>
//                     </div>
//                     <div className="tour-price--info__content__item">
//                         <div className="label">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="24"
//                                 height="24"
//                                 fill="none"
//                             >
//                                 <path
//                                     fill="#000"
//                                     fillRule="evenodd"
//                                     d="M3 20.535C3 21.345 3.656 22 4.465 22h15.07c.81 0 1.465-.656 1.465-1.465v-4.794a.293.293 0 0 0-.586 0v4.794a.88.88 0 0 1-.879.88H4.465a.88.88 0 0 1-.879-.88v-1.63a.293.293 0 0 0-.586 0z"
//                                     clipRule="evenodd"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     fillRule="evenodd"
//                                     d="M3 19.361c0 .81.657 1.467 1.467 1.467h11.88c.389 0 .762-.154 1.037-.43l3.186-3.186c.275-.275.43-.648.43-1.037V4.805c0-.81-.657-1.466-1.467-1.466H4.467C3.657 3.339 3 3.996 3 4.806zm1.467.881a.88.88 0 0 1-.881-.88V4.805a.88.88 0 0 1 .881-.881h15.066a.88.88 0 0 1 .881.88v11.37a.88.88 0 0 1-.258.623l-3.186 3.186a.88.88 0 0 1-.623.258z"
//                                     clipRule="evenodd"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     fillRule="evenodd"
//                                     d="M15.573 20.535c0 .162.13.293.293.293.692 0 1.254-.562 1.254-1.255v-1.955c0-.37.3-.67.67-.67h1.955c.693 0 1.255-.56 1.255-1.254a.293.293 0 0 0-.586 0c0 .37-.3.669-.669.669H17.79c-.693 0-1.255.562-1.255 1.255v1.955c0 .37-.3.67-.668.67a.293.293 0 0 0-.293.292M3 7.819c0 .161.131.292.293.292h3.464a.293.293 0 1 0 0-.585H3.293A.293.293 0 0 0 3 7.819M7.636 7.819c0 .161.131.292.293.292h12.778a.293.293 0 1 0 0-.585H7.929a.293.293 0 0 0-.293.293M5.72 4.786c0 .492.399.891.89.891a.293.293 0 1 0 0-.586.305.305 0 0 1-.304-.305V2.891c0-.169.136-.305.305-.305h.134c.169 0 .305.136.305.305v.74a.293.293 0 0 0 .586 0v-.74A.89.89 0 0 0 6.746 2H6.61a.89.89 0 0 0-.891.89zM16.364 4.786c0 .492.399.891.89.891a.293.293 0 1 0 0-.586.305.305 0 0 1-.304-.305V2.891c0-.169.136-.305.305-.305h.134c.169 0 .305.136.305.305v.74a.293.293 0 1 0 .586 0v-.74A.89.89 0 0 0 17.39 2h-.135a.89.89 0 0 0-.891.89zM4.758 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM8.74 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM12.721 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM16.703 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM4.758 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM8.74 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM12.721 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM16.703 14.961c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V13.58h1.367v1.367zM4.758 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM8.74 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM12.721 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572v.403a.293.293 0 0 0 .586 0v-.389h1.367v1.367h-1.367a.293.293 0 0 0-.586.014"
//                                     clipRule="evenodd"
//                                 ></path>
//                             </svg>
//                             <p>
//                                 Ngày khởi hành: <span>23-10-2024</span>
//                             </p>
//                         </div>
//                     </div>
//                     <div className="tour-price--info__content__item">
//                         <div className="label">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="24"
//                                 height="24"
//                                 fill="none"
//                             >
//                                 <path
//                                     fill="#000"
//                                     d="M6.572 7.057a.36.36 0 0 0-.505.05 7.66 7.66 0 0 0-1.742 4.85c.42 10.142 14.93 10.142 15.35 0a7.6 7.6 0 0 0-1.188-4.093 7.66 7.66 0 0 0-3.203-2.823A7.7 7.7 0 0 0 7.13 6.046a.357.357 0 0 0 .193.631.36.36 0 0 0 .263-.079c4.46-3.712 11.414-.435 11.37 5.359a6.93 6.93 0 0 1-2.04 4.899A6.98 6.98 0 0 1 12 18.888c-5.815.04-9.097-6.882-5.378-11.328a.356.356 0 0 0-.05-.503"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     d="M12 6.642a.36.36 0 0 0 .359-.357V5.88A.356.356 0 0 0 12 5.522a.36.36 0 0 0-.359.358v.405a.355.355 0 0 0 .222.33.4.4 0 0 0 .137.027M7.722 8.198a.36.36 0 0 0 .607-.254.36.36 0 0 0-.1-.251l-.288-.287a.36.36 0 0 0-.607.254c0 .094.035.184.1.252zM6.308 11.598h-.406a.36.36 0 0 0-.352.357.356.356 0 0 0 .352.357h.406a.36.36 0 0 0 .352-.357.357.357 0 0 0-.352-.357M7.434 16.503a.36.36 0 0 0 .507 0l.288-.286a.357.357 0 1 0-.507-.505l-.288.286a.357.357 0 0 0 0 .505M11.641 17.625v.405a.357.357 0 0 0 .359.35.36.36 0 0 0 .359-.35v-.405a.358.358 0 0 0-.61-.248.36.36 0 0 0-.108.248M15.771 16.217c.133.113.34.415.541.39a.362.362 0 0 0 .35-.426.36.36 0 0 0-.096-.183l-.288-.287a.36.36 0 0 0-.607.255c-.001.093.035.184.1.251M18.099 12.312a.36.36 0 0 0 .351-.357.357.357 0 0 0-.352-.357h-.406a.36.36 0 0 0-.352.357.357.357 0 0 0 .352.357zM16.025 8.303c.2.024.41-.279.54-.391a.357.357 0 0 0-.253-.61.36.36 0 0 0-.253.104l-.288.287a.36.36 0 0 0 .254.61"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     d="M20.502 6.349a.36.36 0 0 0 .507 0l.292-.29a2.38 2.38 0 0 0 0-3.37 2.46 2.46 0 0 0-1.903-.681 2.46 2.46 0 0 0-1.77.972.355.355 0 0 0-.001.505l1.184 1.18-.503.5c-3.42-3.278-9.215-3.274-12.623-.006l-.496-.494 1.184-1.18a.357.357 0 0 0 0-.505 2.45 2.45 0 0 0-1.771-.972 2.46 2.46 0 0 0-1.903.681 2.38 2.38 0 0 0 0 3.37c.153.127.33.409.546.395a.36.36 0 0 0 .254-.105l1.183-1.18.496.495C1.68 9.28 1.953 15.488 5.725 18.79l-.974 2.733a.356.356 0 0 0 .338.477h1.624a.36.36 0 0 0 .29-.147l1.09-1.492a9.27 9.27 0 0 0 7.81-.006l1.094 1.498a.36.36 0 0 0 .29.147h1.624a.362.362 0 0 0 .338-.477l-.978-2.744a9.2 9.2 0 0 0 2.999-6.08.356.356 0 0 0-.33-.384.36.36 0 0 0-.385.328c-1.28 10.829-16.743 10.234-17.141-.687 0-2.208.857-4.332 2.393-5.925a8.604 8.604 0 0 1 11.885-.476 8.54 8.54 0 0 1 2.863 5.715.357.357 0 0 0 .385.328.36.36 0 0 0 .33-.384 9.18 9.18 0 0 0-2.455-5.543l.503-.501zM3.244 5.591c-1.611-1.605.756-3.962 2.367-2.358zm15.158 15.694h-.934l-.92-1.26a9.4 9.4 0 0 0 1.136-.754zm-11.872 0h-.934l.715-2.005q.54.417 1.135.751zm11.895-18.09c1.632-1.534 3.92.821 2.329 2.396l-2.367-2.358z"
//                                 ></path>
//                                 <path
//                                     fill="#000"
//                                     d="M11.641 10.85a1.17 1.17 0 0 0-.75.748H8.77a.36.36 0 0 0-.35.357.357.357 0 0 0 .35.357h2.12a1.16 1.16 0 0 0 .837.777 1.173 1.173 0 0 0 1.4-.816 1.16 1.16 0 0 0-.77-1.424V7.905a.357.357 0 0 0-.358-.35.36.36 0 0 0-.359.35zM12 12.407a.455.455 0 0 1-.448-.453.45.45 0 0 1 .448-.453.455.455 0 0 1 .448.453.45.45 0 0 1-.448.453"
//                                 ></path>
//                             </svg>
//                             <p>
//                                 Thời gian: <span>5N4Đ</span>
//                             </p>
//                         </div>
//                     </div>
//                     <div className="tour-price--info__content__item">
//                         <div className="label">
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="24"
//                                 height="24"
//                                 fill="none"
//                             >
//                                 <path
//                                     fill="#000"
//                                     d="M11.677 15.29q.001-.075-.005-.152l-.53-7.354a2.057 2.057 0 0 0-2.045-1.91h-.645V5.21a1.13 1.13 0 0 0 .886-1.539l-.347-.868A1.27 1.27 0 0 0 7.807 2H5.87a1.27 1.27 0 0 0-1.185.802l-.347.869a1.13 1.13 0 0 0 .887 1.538v.666H4.58a2.057 2.057 0 0 0-2.046 1.908l-.53 7.355Q2 15.215 2 15.29a2.19 2.19 0 0 0 .91 1.774A1.775 1.775 0 0 0 2.042 19l.401 1.803A1.52 1.52 0 0 0 3.936 22h5.806a1.52 1.52 0 0 0 1.492-1.197L11.636 19a1.77 1.77 0 0 0-.868-1.936 2.19 2.19 0 0 0 .91-1.774m-2.58 0a1.1 1.1 0 0 1-.698.258H5.28a1.1 1.1 0 0 1-.698-.258v-.02c0-.444-.012-.889-.02-1.334h4.556c-.008.444-.02.89-.02 1.333zm.03-2H4.55a72 72 0 0 0-.137-2.903h4.85q-.096 1.452-.137 2.903M4.58 16.045c.22.097.457.148.697.148H8.4c.24 0 .478-.051.698-.149v.795H4.58zm.322-11.953q0-.094.035-.182l.348-.868a.63.63 0 0 1 .585-.397h1.936a.63.63 0 0 1 .585.397l.347.868a.49.49 0 0 1-.453.67H5.392a.49.49 0 0 1-.489-.488m.968 1.134h1.936v.649H5.87zM9.097 6.52c.175 0 .349.033.511.097a74 74 0 0 0-.295 3.124H4.365a74 74 0 0 0-.296-3.124 1.4 1.4 0 0 1 .512-.097zm-6.448 8.665.53-7.355c.02-.275.12-.539.29-.757a74 74 0 0 1 .467 8.196v1.544a1.55 1.55 0 0 1-1.29-1.523q0-.053.003-.105m7.956 5.478a.88.88 0 0 1-.863.692H3.936a.88.88 0 0 1-.863-.692l-.337-1.515c.278.177.6.271.93.271h6.346c.33 0 .652-.094.93-.27zm-.702-3.18a1.13 1.13 0 0 1 1.057.74 1.09 1.09 0 0 1-.948.551H3.665a1.09 1.09 0 0 1-.946-.55 1.13 1.13 0 0 1 1.057-.74zm-.161-.67v-1.544a74 74 0 0 1 .467-8.197c.17.218.27.482.29.758l.53 7.355q.004.052.004.106a1.55 1.55 0 0 1-1.291 1.522M22 15.29q0-.075-.005-.152l-.53-7.354a2.057 2.057 0 0 0-2.046-1.91h-.645V5.21a1.13 1.13 0 0 0 .886-1.539l-.347-.868A1.27 1.27 0 0 0 18.13 2h-1.936a1.27 1.27 0 0 0-1.184.802l-.347.869a1.13 1.13 0 0 0 .886 1.538v.666h-.645a2.057 2.057 0 0 0-2.046 1.908l-.53 7.355a2.2 2.2 0 0 0 .237 1.148c.158.308.388.575.669.777A1.77 1.77 0 0 0 12.365 19l.4 1.803A1.52 1.52 0 0 0 14.259 22h5.806a1.52 1.52 0 0 0 1.493-1.197l.4-1.803a1.77 1.77 0 0 0-.867-1.936A2.19 2.19 0 0 0 22 15.29m-2.58 0a1.1 1.1 0 0 1-.698.258H15.6a1.1 1.1 0 0 1-.698-.258v-.02c0-.444-.012-.889-.02-1.334h4.557c-.009.444-.02.89-.02 1.333zm.03-2h-4.577a72 72 0 0 0-.137-2.903h4.85a78 78 0 0 0-.137 2.903m-4.547 2.755c.22.097.457.148.698.148h3.12c.241 0 .479-.051.698-.149v.795h-4.516zm.323-11.953q0-.094.035-.182l.347-.868a.63.63 0 0 1 .585-.397h1.936a.63.63 0 0 1 .585.397l.348.868a.49.49 0 0 1-.454.67h-2.894a.49.49 0 0 1-.488-.488m.967 1.134h1.936v.649h-1.936zM19.42 6.52c.175 0 .349.033.512.097a74 74 0 0 0-.296 3.124h-4.948a74 74 0 0 0-.295-3.124 1.4 1.4 0 0 1 .511-.097zm-6.448 8.665.53-7.355c.02-.275.12-.539.29-.757.308 2.721.464 5.457.467 8.196v1.544a1.55 1.55 0 0 1-1.29-1.523q0-.053.003-.105m7.956 5.478a.88.88 0 0 1-.863.692h-5.806a.88.88 0 0 1-.863-.692l-.336-1.515c.277.177.6.271.929.271h6.347c.329 0 .651-.094.929-.27zm-.701-3.18a1.13 1.13 0 0 1 1.056.74 1.09 1.09 0 0 1-.947.551h-6.347a1.09 1.09 0 0 1-.946-.55 1.13 1.13 0 0 1 1.056-.74zm-.162-.67v-1.544c.003-2.739.16-5.475.468-8.197.17.218.27.482.29.758l.53 7.355q.003.052.003.106a1.55 1.55 0 0 1-1.29 1.522"
//                                 ></path>
//                             </svg>
//                             <p>
//                                 Số chỗ còn: <span>3 chỗ</span>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="book-tour-option">
//                 <button
//                     className="btn-book rounded-lg btn-advise button"
//                     type="button"
//                     aria-label="Ngày khác"
//                 >
//                     Ngày khác
//                 </button>
//                 <button
//                     className="btn-book rounded-lg btn-bookTour button"
//                     type="button"
//                     aria-label="Đặt tour"
//                 >
//                     Đặt tour
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Temp;
