'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MENU_CATEGORIES, MenuItem } from '@/constants/menus';
import styles from './MenuRoulette.module.css';

export default function MenuRoulette() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinItems, setSpinItems] = useState<MenuItem[]>([]);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SPIN_DURATION_MS = 4200;

  // Initialize with all items selected
  useEffect(() => {
    const allIds = MENU_CATEGORIES.flatMap(cat => cat.items.map(item => item.id));
    setSelectedIds(allIds);
  }, []);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  const isAllSelected = selectedIds.length === MENU_CATEGORIES.flatMap(cat => cat.items).length;

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      const allIds = MENU_CATEGORIES.flatMap(cat => cat.items.map(item => item.id));
      setSelectedIds(allIds);
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCategory = (catId: string) => {
    const cat = MENU_CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    const catItemIds = cat.items.map(i => i.id);
    const allSelected = catItemIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !catItemIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...catItemIds])]);
    }
  };

  const activeItems = MENU_CATEGORIES.flatMap(cat => cat.items).filter(i => selectedIds.includes(i.id));
  const wheelItems = isOverlayOpen ? spinItems : activeItems;
  const wheelBackground = (() => {
    if (wheelItems.length <= 0) return '#ffffff';
    const step = 360 / wheelItems.length;
    const stops: string[] = [];
    for (let i = 0; i < wheelItems.length; i += 1) {
      const start = i * step;
      const end = (i + 1) * step;
      const color = i % 2 === 0 ? '#2ac1bc' : '#ffffff';
      stops.push(`${color} ${start}deg ${end}deg`);
    }
    return `conic-gradient(${stops.join(', ')})`;
  })();

  const spin = () => {
    if (activeItems.length === 0 || isSpinning) return;

    const currentItems = [...activeItems];
    const anglePerSegment = 360 / currentItems.length;
    const targetIndex = Math.floor(Math.random() * currentItems.length);
    const targetItem = currentItems[targetIndex];
    const targetCenterAngle = targetIndex * anglePerSegment + anglePerSegment / 2;
    const targetStopAngle = (360 - targetCenterAngle + 360) % 360;
    const currentRotationNormalized = ((rotation % 360) + 360) % 360;
    const deltaToTarget = (targetStopAngle - currentRotationNormalized + 360) % 360;
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const nextRotation = rotation + fullSpins * 360 + deltaToTarget;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    setSpinItems(currentItems);
    setIsOverlayOpen(true);
    setIsSpinning(true);
    setResult(null);
    // 오버레이가 먼저 렌더된 후 회전을 시작해야 첫 회전도 애니메이션이 보장된다.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRotation(nextRotation);
      });
    });

    spinTimeoutRef.current = setTimeout(() => {
      setResult(targetItem.name);
      setIsSpinning(false);
    }, SPIN_DURATION_MS);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>오늘 뭐 먹지?</h2>
        <button 
          className={`${styles.globalToggle} ${isAllSelected ? styles.allActive : ''}`}
          onClick={toggleAll}
        >
          <span className={styles.toggleIcon}>{isAllSelected ? '☑' : '☐'}</span>
          전체 선택
        </button>
      </div>
      
      <div className={styles.filterSection}>
        {MENU_CATEGORIES.map(cat => {
          const isCatAllSelected = cat.items.every(i => selectedIds.includes(i.id));
          return (
            <div key={cat.id} className={styles.categoryGroup}>
              <div className={styles.categoryHeader} onClick={() => toggleCategory(cat.id)}>
                <span className={styles.categoryName}>{cat.name}</span>
                {cat.description && <span className={styles.categoryDesc}>{cat.description}</span>}
                <div className={`${styles.categoryCheck} ${isCatAllSelected ? styles.checked : ''}`}>
                  {isCatAllSelected ? '☑' : '☐'}
                </div>
              </div>
              <div className={styles.itemsGrid}>
                {cat.items.map(item => (
                  <label key={item.id} className={`${styles.itemLabel} ${selectedIds.includes(item.id) ? styles.active : ''}`}>
                    <input
                      type="checkbox"
                      className={styles.hiddenCheckbox}
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className={styles.itemName}>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className={styles.spinButton} 
        onClick={spin}
        disabled={selectedIds.length === 0 || isSpinning}
      >
        {isSpinning ? '룰렛 회전 중...' : '룰렛 돌리기'}
      </button>

      {/* Spinning Overlay & Result */}
      {isOverlayOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.rouletteWrapper}>
              <div 
                className={styles.wheel} 
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: `${SPIN_DURATION_MS}ms`,
                  background: wheelBackground,
                }}
              >
                {wheelItems.map((item, index) => {
                  const angle = 360 / wheelItems.length;
                  const rotate = angle * index;
                  const isEven = index % 2 === 0;
                  const labelColor = isEven ? '#ffffff' : '#111111';
                  const fontSize = wheelItems.length >= 20 ? '0.66rem' : wheelItems.length >= 14 ? '0.74rem' : '0.84rem';
                  const labelDistance = wheelItems.length >= 20 ? '-121%' : wheelItems.length >= 14 ? '-123%' : '-125%';
                  return (
                    <div 
                      key={item.id} 
                      className={styles.segment}
                      style={{ 
                        transform: `rotate(${rotate}deg)`,
                      }}
                    >
                      <span 
                        className={styles.segmentText}
                        style={{ 
                          color: labelColor,
                          ['--segment-font-size' as string]: fontSize,
                          transform: `translate(-50%, -50%) rotate(${angle / 2}deg) translateY(${labelDistance})`,
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
                <div className={styles.wheelCenterInner} />
              </div>
              <div className={styles.pointer}>▼</div>
            </div>

            {result && !isSpinning && (
              <div className={styles.resultBox}>
                <p className={styles.resultLabel}>오늘의 추천 메뉴는?</p>
                <h3 className={styles.resultName}>{result}</h3>
                <div className={styles.actionButtons}>
                  <button className={styles.retryButton} onClick={spin}>다시 돌리기</button>
                  <button
                    className={styles.closeButton}
                    onClick={() => {
                      setResult(null);
                      setIsOverlayOpen(false);
                    }}
                  >
                    완료
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
