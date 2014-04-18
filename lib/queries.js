var queryFields;

module.exports = {
  listAccounts: function() {
    queryFields = [
      'Id',
      'AccountNumber',
      'Industry',
      'Name',
      'Rating',
      'Website',
      'Type',
      'BillingStreet',
      'BillingCity',
      'BillingState',
      'BillingPostalCode',
      'BillingCountry',
      'Phone'
    ].join(', ');
    return "SELECT " + queryFields + " FROM Account ORDER BY Id DESC LIMIT 50";
    
  },

  listCases: function() {
    queryFields = [
      'Id',
      'CaseNumber',
      'IsClosed',
      'Origin',
      'Priority',
      'Reason',
      'Subject',
      'Type'
    ].join(', ');
    return "SELECT " + queryFields + " FROM Case ORDER BY CaseNumber DESC LIMIT 50";
  },

  listOpps: function() {
    queryFields = [
      'Id',
      'AccountId',
      'Amount',
      'CampaignId',
      'CloseDate',
      'Description',
      'ExpectedRevenue',
      'FiscalYear',
      'FiscalQuarter',
      'IsClosed',
      'IsWon',
      'Name',
      'Probability',
      'StageName',
      'Type'
    ].join(', ');
    return "SELECT " + queryFields + " FROM Opportunity ORDER BY Probability DESC LIMIT 50";
  },

  listCampaigns: function() {
    queryFields = [
      'Id',
      'Name',
      'Status',
      'IsActive',
      'BudgetedCost',
      'ActualCost',
    ].join(', ');
    return "SELECT " + queryFields + " FROM Campaign ORDER BY Status DESC LIMIT 50"; 
  }

}