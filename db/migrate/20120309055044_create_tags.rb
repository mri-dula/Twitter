class CreateTags < ActiveRecord::Migration
  def up
    create_table :tags do |t|
      t.string :text
      t.integer :post_id
    end
  end

  def down
  end

end
