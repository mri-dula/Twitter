class AddAttributesToUser < ActiveRecord::Migration
  def change
  	add_column :users, :first_name, :string
  	add_column :users, :last_name, :string
  	add_column :users, :location, :text
  	add_column :users, :friends_count, :integer, :default => 0
  	add_column :users, :follower_count, :integer, :default => 0
  	add_column :users, :status_count, :integer, :default => 0
  	add_column :users, :protected, :boolean, :default => false
  end
end
