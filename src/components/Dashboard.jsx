import React from 'react';
import Header from './Header';
import StatsGrid from './StatsGrid';
import WalletsSection from './WalletsSection';
import TransactionsSection from './TransactionsSection';

const Dashboard = ({ onMenuClick }) => {
    return (
        <main className="flex-1 overflow-y-auto relative flex flex-col hide-scroll">
            <Header onMenuClick={onMenuClick} />
            <div className="p-4 md:p-8 flex flex-col gap-8 max-w-[1600px]">
                <StatsGrid />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <WalletsSection />
                </div>
                <TransactionsSection />
            </div>
        </main>
    );
};

export default Dashboard;
