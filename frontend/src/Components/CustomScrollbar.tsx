import React, { useState, useRef } from 'react';
import '../CSS Sheets/CustomScrollbar.css';

interface CustomScrollbarProps {
    children: React.ReactNode;
    height: number;
    width: number;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
    children,
    height,
    width,
}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const scrollbarHeight = scrollbarRef.current?.offsetHeight || 0;
        const contentHeight = contentRef.current?.offsetHeight || 0;
        const scrollPosition = (contentRef.current?.scrollTop || 0) / (contentHeight - height);
        setScrollPosition(scrollPosition);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const scrollbarHeight = scrollbarRef.current?.offsetHeight || 0;
        const contentHeight = contentRef.current?.offsetHeight || 0;
        const mouseY = e.clientY;
        const scrollbarY = scrollbarRef.current?.getBoundingClientRect().top || 0;
        const scrollPosition = (mouseY - scrollbarY) / scrollbarHeight;
        const newScrollTop = scrollPosition * (contentHeight - height);
        contentRef.current?.scrollTo({ top: newScrollTop });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.buttons === 1) {
            handleMouseDown(e);
        }
    };

    return (
        <div className="custom-scrollbar" style={{ height, width, overflowY: 'hidden' }}>
            <div
                className="custom-scrollbar-content"
                ref={contentRef}
                onScroll={handleScroll}
                style={{ overflowY: 'scroll', height: '100%' }}
            >
                {children}
            </div>
            <div
                className="custom-scrollbar-scrollbar"
                ref={scrollbarRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                style={{ top: `${scrollPosition * (height - 20)}px` }}
            />
        </div>
    );
};

export default CustomScrollbar;