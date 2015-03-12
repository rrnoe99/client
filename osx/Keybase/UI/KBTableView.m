//
//  KBListView.m
//  Keybase
//
//  Created by Gabriel on 2/2/15.
//  Copyright (c) 2015 Gabriel Handford. All rights reserved.
//

#import "KBTableView.h"

#import "KBAppearance.h"
#import "KBScrollView.h"
#import "KBCellDataSource.h"
#import "KBLayouts.h"
#import <GHKit/GHKit.h>

@interface KBTableView ()
@property KBScrollView *scrollView;
@property NSTableView *view;
@property KBCellDataSource *dataSource;
@end

@implementation KBTableView

- (void)viewInit {
  [super viewInit];
  _dataSource = [[KBCellDataSource alloc] init];

  _view = [[NSTableView alloc] init];
  _view.dataSource = self;
  _view.delegate = self;

  _scrollView = [[KBScrollView alloc] init];
  [_scrollView setDocumentView:_view];
  [self addSubview:_scrollView];

  YOSelf yself = self;
  self.viewLayout = [YOLayout layoutWithLayoutBlock:^(id<YOLayout> layout, CGSize size) {
    UIEdgeInsets insets = yself.border.insets;
    [layout setSize:size view:yself.border options:0];
    [layout setFrame:CGRectMake(insets.left, insets.top, size.width - insets.left - insets.right, size.height - insets.top - insets.bottom) view:yself.scrollView];
    return size;
  }];

  // Fix scroll position with header view
  dispatch_async(dispatch_get_main_queue(), ^{
    [yself.view scrollPoint:NSMakePoint(0, -yself.view.headerView.frame.size.height)];
  });
}

- (void)setBorderWithColor:(NSColor *)color width:(CGFloat)width borderType:(KBBorderType)borderType {
  [_border removeFromSuperview];
  _border = [[KBBorder alloc] init];
  _border.color = color;
  _border.width = width;
  _border.borderType = borderType;
  [self addSubview:_border];
  [self setNeedsLayout];
}

- (void)removeAllObjects {
  [_dataSource removeAllObjects];
  [_view reloadData];
}

- (void)setObjects:(NSArray *)objects {
  [_dataSource setObjects:objects];
  [_view reloadData];
}

- (void)setObjects:(NSArray *)objects animated:(BOOL)animated {
  id selectedObject = [self selectedObject];

  NSMutableArray *indexPathsToRemove = [NSMutableArray array];
  NSMutableArray *indexPathsToUpdate = [NSMutableArray array];
  NSMutableArray *indexPathsToAdd = [NSMutableArray array];
  //if ([indexPathsToRemove count] == 0 && [indexPathsToAdd count] == 0) return;
  [self.dataSource updateObjects:objects section:0 indexPathsToAdd:indexPathsToAdd indexPathsToUpdate:indexPathsToUpdate indexPathsToRemove:indexPathsToRemove];
  if (animated) {
    [_view beginUpdates];
    if ([indexPathsToRemove count] > 0) [_view removeRowsAtIndexes:[self itemIndexSet:indexPathsToRemove] withAnimation:0];
    if ([indexPathsToAdd count] > 0) [_view insertRowsAtIndexes:[self itemIndexSet:indexPathsToAdd] withAnimation:0];
    if ([indexPathsToUpdate count] > 0) [_view reloadDataForRowIndexes:[self itemIndexSet:indexPathsToUpdate] columnIndexes:[self sectionIndexSet:indexPathsToUpdate]];
    [_view endUpdates];
  } else {
    [_view reloadData];
  }
  
  if (selectedObject) {
    NSIndexPath *indexPath = [_dataSource indexPathOfObject:selectedObject section:0];
    [_view selectRowIndexes:[NSIndexSet indexSetWithIndex:indexPath.item] byExtendingSelection:NO];
  }
}

- (NSIndexSet *)itemIndexSet:(NSArray *)indexPaths {
  NSMutableIndexSet *indexSet = [[NSMutableIndexSet alloc] init];
  for (NSIndexPath *indexPath in indexPaths) {
    [indexSet addIndex:indexPath.item];
  }
  return indexSet;
}

- (NSIndexSet *)sectionIndexSet:(NSArray *)indexPaths {
  NSMutableIndexSet *indexSet = [[NSMutableIndexSet alloc] init];
  for (NSIndexPath *indexPath in indexPaths) {
    [indexSet addIndex:indexPath.section];
  }
  return indexSet;
}

- (void)addObjects:(NSArray *)objects {
  [_dataSource addObjects:objects];
  [_view reloadData];
}

- (NSInteger)numberOfRowsInTableView:(NSTableView *)tableView {
  return [_dataSource countForSection:0];
}

- (void)deselectAll {
  [_view deselectAll:nil];
}

- (void)selectItem:(id)item {

}

- (id)selectedObject {
  NSInteger selectedRow = [_view selectedRow];
  if (selectedRow < 0) return nil;
  return [_dataSource objectAtIndexPath:[NSIndexPath indexPathForItem:selectedRow inSection:0]];
}

- (void)tableViewSelectionDidChange:(NSNotification *)notification {
  NSInteger selectedRow = [_view selectedRow];
  if (selectedRow < 0) return;
  id object = [self selectedObject];
  if (object) {
    [self selectItem:object];
    if (self.selectBlock) self.selectBlock(self, [NSIndexPath indexPathWithIndex:selectedRow], object);
  }
}

- (void)removeAllTableColumns {
  for (NSTableColumn *tableColumn in [_view.tableColumns copy]) {
    [_view removeTableColumn:tableColumn];
  }
}

@end


