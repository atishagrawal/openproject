//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

export class ApiWorkPackagesService {
  constructor (protected DEFAULT_PAGINATION_OPTIONS,
               protected $stateParams,
               protected $q:ng.IQService,
               protected apiV3:restangular.IService) {
  }

  public list(offset:number, pageSize:number, query:api.ex.Query) {
    const workPackages;

    if (query.project_id) {
      workPackages = this.apiV3.service('work_packages', this.apiV3.one('projects', query.project_id));
    }
    else {
      workPackages = this.apiV3.service('work_packages');
    }

    return workPackages.getList(this.queryAsV3Params(offset, pageSize, query)).then(wpCollection => {
      return wpCollection;
    });
  }

  protected queryAsV3Params(offset:number, pageSize:number, query:api.ex.Query) {

    const v3Filters = _.map(query.filters, (filter) => {
      const newFilter = {};
      newFilter[filter.name] = {operator: filter.operator, values: filter.values};
      return newFilter;
    });

    const params = {
      offset: offset,
      pageSize: pageSize,
      filters: [v3Filters]
    };

    if (query.group_by) {
      params['groupBy'] = query.group_by;
    }

    if (query.display_sums) {
      params['showSums'] = query.display_sums;
    }

    if (query.sort_criteria) {
      params['sortBy'] = [query.sort_criteria];
    }

    return params;
  }
}

angular
  .module('openproject.api')
  .service('apiWorkPackages', ApiWorkPackagesService);
